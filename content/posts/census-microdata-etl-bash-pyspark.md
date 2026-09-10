---
title: "Observations on Census Microdata: Extraction, Transformation, and Loading with Bash, PySpark, and Cloud Storage"
date: 2023-01-20T17:28:10Z
draft: false
description: "A hands-on guide to building an efficient big data pipeline for Brazilian Demographic Census microdata using Bash automation, PySpark positional parsing, Parquet partitioning, and Cloud Storage."
tags: ["PySpark", "Big Data", "Data Engineering", "Bash", "Linux", "GCP", "ETL", "Cloud Storage"]
categories: ["Data Engineering", "Big Data", "Cloud"]
cover:
  image: "https://gui13go.github.io/images/census-microdata-cover.png"
  alt: "Census Microdata ETL with Bash and PySpark"
  caption: "Large-Scale Data Engineering with PySpark and Cloud Storage"
  relative: false
canonicalURL: "https://medium.com/@guilhermeviegas/observa%C3%A7%C3%B5es-sobre-os-microdados-do-censo-extra%C3%A7%C3%A3o-transforma%C3%A7%C3%A3o-e-carregamento-com-bash-pyspark-f895b2ee739d"
---

Extracting, transforming, and loading (ETL) massive demographic datasets is always a formidable engineering challenge. The larger the volume and granularity of the data, the more crucial it becomes to select the right architectural patterns, distributed frameworks, and optimized storage formats.

In this guide, we explore how to ingest, parse, and process Brazilian Demographic Census (**IBGE**) microdata from scratch using a robust stack: **Bash scripting** for workflow automation, **PySpark** for distributed parsing of raw fixed-width positional files, and **Apache Parquet / Cloud Storage** for high-performance analytical queries.

---

## 1. What Are Census Microdata?

As the name suggests, microdata represents census data at its highest degree of granularity: individual responses recorded for each interviewed household and inhabitant.

During national demographic operations (such as the 2010 and 2022 Censuses conducted by IBGE in Brazil), two distinct questionnaires are administered across the population:
1. **The Basic Questionnaire (*Questionário Básico*):** Applied to the vast majority of households, gathering fundamental demographic variables.
2. **The Sample Questionnaire (*Questionário da Amostra*):** Administered to an empirical representative sample (~10% of households) containing comprehensive, detailed socio-economic, migratory, and labor indicators.

For basic questionnaire data, researchers can often rely on aggregate tables (e.g., aggregated by census tracts / *setores censitários*). However, for advanced socio-economic research, econometric modeling, and complex spatial analyses, the **Sample Microdata** is indispensable. 

> 📌 **Note on Spatial Granularity:** To preserve statistical confidentiality and prevent re-identification, microdata records are not published at the individual tract level. Instead, the smallest identifiable geographic entity is the **Weighting Area (*Área de Ponderação*)**, which groups contiguous census tracts with a minimum population threshold.

---

## 2. Ingesting Raw Data with Bash Automation

The official data repositories provide individual compressed archives organized by Federative Unit (State). In this demonstration, we use the state of Santa Catarina (`SC`, State code `42`) as our benchmark dataset.

We can automate both the download and extraction of the microdata and its accompanying documentation dictionary using native Unix tools:

```bash
# 1. Download Census Sample Microdata (Santa Catarina - SC)
mkdir -p data/microdados_censo data/documentacao
curl https://ftp.ibge.gov.br/Censos/Censo_Demografico_2010/Resultados_Gerais_da_Amostra/Microdados/SC.zip \
  -o data/microdados_censo.zip

# 2. Decompress raw datasets
unzip data/microdados_censo.zip -d data/microdados_censo/

# 3. Download corresponding technical documentation & layout dictionary
curl https://ftp.ibge.gov.br/Censos/Censo_Demografico_2010/Resultados_Gerais_da_Amostra/Microdados/Documentacao.zip \
  -o data/documentacao.zip

# 4. Decompress documentation files
unzip data/documentacao.zip -d data/documentacao/
```

After extraction, the directory contains the core entity tables:
- `Amostra_Domicilios_42.txt` (Household records)
- `Amostra_Pessoas_42.txt` (Individual inhabitant records)
- `Amostra_Emigracao_42.txt` (International emigration records)
- `Amostra_Mortalidade_42.txt` (Mortality records)

---

## 3. Understanding the Positional Fixed-Width Format

If you inspect any of the extracted `.txt` files in a standard text editor, you will encounter continuous lines of numeric streams without delimiters (such as commas or tabs):

```text
420000100001000000000000100000000000000110100101000000000000000000000000000000000000000...
```

This is a **fixed-width format (FWF)**. To parse these lines into structured relational columns, we must cross-reference the byte offsets against the official data dictionary (`Layout_microdados_amostra.xls` found in the documentation bundle):

![IBGE Microdata Layout Dictionary](/images/census-dictionary-preview.png)

The layout dictionary outlines:
- **Variable Identifier** (e.g., `V0001`, `V0002`, `V0010`)
- **Initial Position** (1-indexed starting position)
- **Column Length** (Number of characters)
- **Scale / Decimals** (Implicit decimal digits for weights and expansion factors)

---

## 4. Distributed Processing with PySpark

When working with national-scale data, loading entire state files with `pandas` quickly exhausts local RAM and risks Out-Of-Memory (OOM) crashes. 

Instead, we leverage **Apache Spark via PySpark**, reading the dataset lazily as a distributed DataFrame where transformations are evaluated in parallel.

### Initializing the Spark Session

```python
import pyspark
from pyspark.sql import SparkSession
from pyspark.sql import functions as F

# Initialize optimized SparkSession
spark = SparkSession.builder \
    .appName("census_microdata_etl") \
    .config("spark.sql.execution.arrow.pyspark.enabled", "true") \
    .getOrCreate()
```

### Ingesting Raw Text Streams

We load the flat text file without an initial delimiter. Spark treats each line as a single monolithic string column named `_c0`:

```python
# Ingest raw text into a distributed DataFrame
df_domicilios = spark.read.load(
    path="data/microdados_censo/SC/Amostra_Domicilios_42.txt",
    format="csv",
    header="false"
)
```

### Positional Column Slicing

Using PySpark's native `F.substring()`, we unpack the fixed-width fields into standardized columns according to their exact byte offsets:

```python
# Unpack fixed-width fields into discrete schema columns
df_domicilios = df_domicilios \
    .withColumn("V0001", F.substring(F.col("_c0"), 1, 2)) \
    .withColumn("V0002", F.substring(F.col("_c0"), 3, 5)) \
    .withColumn("V0011", F.substring(F.col("_c0"), 8, 13)) \
    .withColumn("V0300", F.substring(F.col("_c0"), 21, 8)) \
    .withColumn("V0010", F.substring(F.col("_c0"), 29, 16)) \
    .withColumn("V1001", F.substring(F.col("_c0"), 45, 1)) \
    .withColumn("V1002", F.substring(F.col("_c0"), 46, 2)) \
    .withColumn("V1003", F.substring(F.col("_c0"), 48, 3)) \
    .withColumn("V1004", F.substring(F.col("_c0"), 51, 2)) \
    .withColumn("V1006", F.substring(F.col("_c0"), 53, 1)) \
    .withColumn("V4001", F.substring(F.col("_c0"), 54, 2)) \
    .withColumn("V4002", F.substring(F.col("_c0"), 56, 2)) \
    .withColumn("V0201", F.substring(F.col("_c0"), 58, 1)) \
    .withColumn("V2011", F.substring(F.col("_c0"), 59, 6)) \
    .withColumn("V2012", F.substring(F.col("_c0"), 65, 9)) \
    .withColumn("V0202", F.substring(F.col("_c0"), 74, 1)) \
    .withColumn("V0203", F.substring(F.col("_c0"), 75, 2)) \
    .withColumn("V6203", F.substring(F.col("_c0"), 77, 3)) \
    .withColumn("V0204", F.substring(F.col("_c0"), 80, 2)) \
    .withColumn("V6204", F.substring(F.col("_c0"), 82, 3)) \
    .withColumn("V0205", F.substring(F.col("_c0"), 85, 1)) \
    .withColumn("V0206", F.substring(F.col("_c0"), 86, 1)) \
    .withColumn("V0207", F.substring(F.col("_c0"), 87, 1)) \
    .withColumn("V0208", F.substring(F.col("_c0"), 88, 2)) \
    .withColumn("V0209", F.substring(F.col("_c0"), 90, 1)) \
    .withColumn("V0210", F.substring(F.col("_c0"), 91, 1)) \
    .withColumn("V0211", F.substring(F.col("_c0"), 92, 1)) \
    .withColumn("V0212", F.substring(F.col("_c0"), 93, 1)) \
    .withColumn("V0213", F.substring(F.col("_c0"), 94, 1)) \
    .withColumn("V0214", F.substring(F.col("_c0"), 95, 1)) \
    .withColumn("V0215", F.substring(F.col("_c0"), 96, 1)) \
    .withColumn("V0216", F.substring(F.col("_c0"), 97, 1)) \
    .withColumn("V0217", F.substring(F.col("_c0"), 98, 1)) \
    .withColumn("V0218", F.substring(F.col("_c0"), 99, 1)) \
    .withColumn("V0219", F.substring(F.col("_c0"), 100, 1)) \
    .withColumn("V0220", F.substring(F.col("_c0"), 101, 1)) \
    .withColumn("V0221", F.substring(F.col("_c0"), 102, 1)) \
    .withColumn("V0222", F.substring(F.col("_c0"), 103, 1)) \
    .withColumn("V0301", F.substring(F.col("_c0"), 104, 1)) \
    .withColumn("V0401", F.substring(F.col("_c0"), 105, 2)) \
    .withColumn("V0402", F.substring(F.col("_c0"), 107, 1)) \
    .withColumn("V0701", F.substring(F.col("_c0"), 108, 1)) \
    .withColumn("V6529", F.substring(F.col("_c0"), 109, 7)) \
    .withColumn("V6530", F.substring(F.col("_c0"), 116, 10)) \
    .withColumn("V6531", F.substring(F.col("_c0"), 126, 8)) \
    .withColumn("V6532", F.substring(F.col("_c0"), 134, 9)) \
    .withColumn("V6600", F.substring(F.col("_c0"), 143, 1)) \
    .withColumn("V6210", F.substring(F.col("_c0"), 144, 1)) \
    .withColumn("M0201", F.substring(F.col("_c0"), 145, 1)) \
    .withColumn("M2011", F.substring(F.col("_c0"), 146, 1)) \
    .withColumn("M0202", F.substring(F.col("_c0"), 147, 1)) \
    .withColumn("M0203", F.substring(F.col("_c0"), 148, 1)) \
    .withColumn("M0204", F.substring(F.col("_c0"), 149, 1)) \
    .withColumn("M0205", F.substring(F.col("_c0"), 150, 1)) \
    .withColumn("M0206", F.substring(F.col("_c0"), 151, 1)) \
    .withColumn("M0207", F.substring(F.col("_c0"), 152, 1)) \
    .withColumn("M0208", F.substring(F.col("_c0"), 153, 1)) \
    .withColumn("M0209", F.substring(F.col("_c0"), 154, 1)) \
    .withColumn("M0210", F.substring(F.col("_c0"), 155, 1)) \
    .withColumn("M0211", F.substring(F.col("_c0"), 156, 1)) \
    .withColumn("M0212", F.substring(F.col("_c0"), 157, 1)) \
    .withColumn("M0213", F.substring(F.col("_c0"), 158, 1)) \
    .withColumn("M0214", F.substring(F.col("_c0"), 159, 1)) \
    .withColumn("M0215", F.substring(F.col("_c0"), 160, 1)) \
    .withColumn("M0216", F.substring(F.col("_c0"), 161, 1)) \
    .withColumn("M0217", F.substring(F.col("_c0"), 162, 1)) \
    .withColumn("M0218", F.substring(F.col("_c0"), 163, 1)) \
    .withColumn("M0219", F.substring(F.col("_c0"), 164, 1)) \
    .withColumn("M0220", F.substring(F.col("_c0"), 165, 1)) \
    .withColumn("M0221", F.substring(F.col("_c0"), 166, 1)) \
    .withColumn("M0222", F.substring(F.col("_c0"), 167, 1)) \
    .withColumn("M0301", F.substring(F.col("_c0"), 168, 1)) \
    .withColumn("M0401", F.substring(F.col("_c0"), 169, 1)) \
    .withColumn("M0402", F.substring(F.col("_c0"), 170, 1)) \
    .withColumn("M0701", F.substring(F.col("_c0"), 171, 1)) \
    .withColumn("V1005", F.substring(F.col("_c0"), 172, 1)) \
    .drop("_c0")
```

### Decimal and Weight Calibrations

Certain demographic attributes—notably sample weighting factors (e.g., `V0010`) and calculated per capita income metrics—store numbers as raw integers with implicit decimal precision. We divide these fields by their respective power of 10:

```python
# Apply scale factors according to dictionary definitions
df_domicilios = df_domicilios \
    .withColumn("V0010", F.col("V0010") / 10**13) \
    .withColumn("V2012", F.col("V2012") / 10**5) \
    .withColumn("V6203", F.col("V6203") / 10**1) \
    .withColumn("V6204", F.col("V6204") / 10**1) \
    .withColumn("V6530", F.col("V6530") / 10**5) \
    .withColumn("V6531", F.col("V6531") / 10**1) \
    .withColumn("V6532", F.col("V6532") / 10**5)
```

---

## 5. Storage Strategy: Why Parquet Outperforms CSV

Once the dataset is cleaned and parsed, persisting it back as uncompressed CSV would be inefficient in both storage space and query runtime. 

Instead, we write the data to **Apache Parquet**, an open-source columnar storage format offering:
- **Snappy Compression:** Shrinking physical footprint by up to 80% compared to raw text.
- **Column Pruning & Predicate Pushdown:** Downstream SQL engines (Spark SQL, DuckDB, Trino, BigQuery) read only the exact columns and byte blocks needed for a given query, drastically cutting I/O overhead.

```python
# Write partitioned Parquet dataset
df_domicilios.write \
    .format("parquet") \
    .mode("overwrite") \
    .option("compression", "snappy") \
    .save("data/microdados/domicilios_parquet/")

# Reload whenever needed in sub-second speeds
df_domicilios = spark.read \
    .format("parquet") \
    .load("data/microdados/domicilios_parquet/")

# Gracefully terminate the Spark driver
spark.stop()
```

---

## 6. Cloud Ingestion (Google Cloud Storage)

With the Parquet partitions created locally, the data is primed for analytical warehousing or serverless querying on the cloud. Using the Google Cloud SDK (`gsutil` or modern `gcloud storage`), we synchronize the directory into an object storage bucket:

```bash
# Upload parquet partitions to Cloud Storage in parallel
gsutil -m cp -r data/microdados/domicilios_parquet/ gs://cloud-storage-bucket-sandbox-gis/
```

From here, external cloud engines like **Google Cloud BigQuery** can immediately query the dataset as an external table without requiring any additional ingestion steps!

---

## 7. Reflections & Conclusion

Demographic census data is one of the richest sources of societal insight available to researchers and data engineers. Having worked hands-on with census operations across hundreds of enumeration sectors and interviewers, I have seen firsthand the dedication required to collect every single data point in the field.

Transforming these raw records into clean, distributed, queryable datasets is the critical bridge that unlocks their analytical value. By pairing automated shell pipelines with PySpark and Parquet, we turn dense fixed-width streams into an accessible foundation for spatial analysis, economic research, and public policy intelligence.
