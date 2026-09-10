---
title: "The Neutrality of Money in the COVID-19 Era: An Animated Macroeconomic Analysis in R"
date: 2020-07-14T10:41:34Z
draft: false
description: "Examining the short-run and long-run macroeconomic effects of expansionary monetary policy on inflation, interest rates, and output across MD-MS, IS-LM, and AD-AS models using animated visualizations in R."
tags: ["R", "Macroeconomics", "Data Visualization", "ggplot2", "gganimate", "Monetary Policy", "Economics"]
categories: ["Economics", "Data Science", "R"]
cover:
  image: "https://gui13go.github.io/images/money-cover.jpeg"
  alt: "The Neutrality of Money in the COVID-19 Era"
  caption: "Macroeconomic Equilibrium Dynamics & Expansionary Monetary Policy"
  relative: false
canonicalURL: "https://medium.com/@guilhermeviegas/neutralidade-da-moeda-na-era-covid19-uma-an%C3%A1lise-animada-atrav%C3%A9s-do-r-b79cc0f3ee98"
---

How do large-scale expansionary monetary policies affect inflation, interest rates, and real output over time? During economic crises—most notably during the global disruptions of the COVID-19 pandemic—central banks worldwide deployed unprecedented monetary expansion to sustain market liquidity.

In this article, we bridge economic theory and data visualization by animating the classical doctrine of the **Neutrality of Money** across three foundational macroeconomic frameworks: **Money Demand & Supply (MD-MS)**, **Goods & Money Market Equilibrium (IS-LM)**, and **Aggregate Demand & Supply (AD-AS)**, utilizing **R**, **`ggplot2`**, and **`gganimate`**.

---

## 1. Theoretical Foundations: What Is the Neutrality of Money?

The **Neutrality of Money** is a foundational tenet of classical and neoclassical macroeconomics. It posits that changes in the nominal money supply ($M$) affect nominal variables (the price level $P$ and nominal wages $W$), but exert **no permanent effect on real economic variables** (such as real output $Y$, real interest rates $r$, or employment) in the long run:

$$\text{In the long run, the real money stock } \frac{M}{P} \text{ remains unchanged.}$$

### Short-Run Expansion vs. Long-Run Adjustment

When a central bank conducts expansionary monetary policy—often colloquially termed *"printing money"*—it injects liquidity into the financial system via:
1. **Open Market Operations (OMO):** Outright purchases of government treasury bonds.
2. **Reserve Requirement Reductions:** Lowering compulsory reserves held by commercial banks.
3. **Discount Window Lending:** Providing credit to commercial institutions at reduced discount rates.

#### In the Short Run:
- Market liquidity surges, driving down the nominal and real interest rate ($r \downarrow$).
- Lower borrowing costs stimulate private investment and consumption ($I \uparrow, C \uparrow$).
- Aggregate Demand expands ($AD \uparrow$), temporarily elevating real output ($Y$) above its natural/structural capacity ($Y > Y_n$).

#### In the Long Run:
- Operating above natural capacity induces upward pressure on input costs and nominal wages.
- As workers and firms revise their inflationary expectations upward, the **Aggregate Supply curve (AS)** shifts upward and leftward.
- Prices rise in direct proportion to the expansion in nominal money supply ($P \uparrow$).
- Real money balances return to baseline ($\frac{M \uparrow}{P \uparrow} = \text{constant}$), restoring the real interest rate and pulling output back to its long-run structural potential ($Y_n$).

$$\pi = g_M - g_Y$$
$$i = r + \pi^e \quad \text{(The Fisher Effect)}$$

> **Key Takeaway:** Over the long horizon, the inflation rate is governed by the growth rate of the money supply relative to potential output, and nominal interest rates adjust upward to reflect inflation expectations.

---

## 2. Animated Macroeconomic Transmission

The animation below synthesizes the dynamic transition across all three interconnected macroeconomic spaces simultaneously:

![Neutrality of Money after an expansionary monetary shock](/images/money-neutrality-animation.gif)

### Reading the Synchronized Models:

1. **Top-Left (Money Market - MD / MS):**
   The initial monetary expansion shifts the Money Supply schedule to the right ($MS_1 \to MS_2$), lowering interest rates. In the long run, as the price level doubles, the real money supply curve contracts precisely back to its original equilibrium ($MS_3 = MS_1$).
2. **Top-Right (Goods & Money Markets - IS / LM):**
   Lower interest rates shift the $LM$ curve outward to $LM_2$, spurring short-run output. As inflation sets in and reduces real liquidity, $LM$ shifts back inward to $LM_3$.
3. **Bottom-Left (Macroeconomic Economy - AD / AS):**
   Increased liquidity drives the Aggregate Demand curve outward ($AD_1 \to AD_2$). However, as price expectations adjust, short-run Aggregate Supply contracts ($AS_1 \to AS_2$), resulting in permanently higher equilibrium prices with zero permanent gain in real GDP.

---

## 3. Implementation in R: `ggplot2` & `gganimate`

To simulate these dynamic shifts cleanly, we structure the linear equations for each market equilibrium, solve for their intersection points across distinct phases (`t = 1` baseline, `t = 2` short-run shock, `t = 3` long-run neutrality), and interpolate transitions with `gganimate`.

Here is an improved and organized excerpt of the simulation pipeline:

```r
###########################################################################
## Animated Neutrality of Money Simulation                               ##
## Author: Guilherme Viegas                                              ##
###########################################################################

library(dplyr)
library(ggplot2)
library(gganimate)
library(magick)

# 1. Domain & Behavioral Curves Setup ------------------------------------
x <- seq(0, 1000, length.out = 1000)

# IS curves (Goods market equilibrium)
is_curve <- -0.8 * x + 900

# LM curves (Money market equilibrium: Baseline -> Expansion -> Neutrality)
lm_t1 <-  0.9 * x + 100   # Initial state
lm_t2 <-  0.9 * x - 100   # Short-run liquidity expansion
lm_t3 <-  0.9 * x + 100   # Long-run price adjustment back to baseline

# Aggregate Demand & Supply Curves
ad_t1 <- -1.0 * x + 800
ad_t2 <- -1.0 * x + 1000  # Shift outward due to monetary stimulus
ad_t3 <- -1.0 * x + 1000

as_t1 <-  1.0 * x + 100   # Initial supply
as_t2 <-  1.0 * x + 100   # Sticky short-run supply
as_t3 <-  1.0 * x + 300   # Long-run supply contraction (cost adjustment)

# 2. Assembling Time-Series Frames for gganimate --------------------------
df_sim <- bind_rows(
  data.frame(x = x, y = lm_t1, state = 1, model = "LM Curve", phase = "1. Pre-Shock Baseline"),
  data.frame(x = x, y = lm_t2, state = 2, model = "LM Curve", phase = "2. Short-Run Expansion"),
  data.frame(x = x, y = lm_t3, state = 3, model = "LM Curve", phase = "3. Long-Run Neutrality")
)

# 3. Dynamic Visualization Rendering -------------------------------------
p <- ggplot(df_sim, aes(x = x, y = y, color = model)) +
  geom_line(size = 1.3) +
  scale_color_brewer(palette = "Set1") +
  theme_minimal(base_family = "sans") +
  labs(
    title = "Macroeconomic Dynamic Adjustment: {closest_state}",
    subtitle = "Transition from Short-Run Stimulus to Long-Run Monetary Neutrality",
    x = "Real Output (Y)",
    y = "Interest Rate (r) / Price Level (P)"
  ) +
  theme(
    plot.title = element_text(face = "bold", size = 16),
    legend.position = "bottom"
  ) +
  transition_states(phase, transition_length = 3, state_length = 2) +
  ease_aes("cubic-in-out")

# Render GIF animation
# animate(p, nframes = 120, fps = 20, width = 800, height = 550, renderer = gifski_renderer())
```

> 📦 **Full Source Code:** The complete multi-panel compilation script is openly available in my GitHub repository: [gui13go/neutralidade-da-moeda](https://github.com/gui13go/neutralidade-da-moeda).

---

## 4. Reflections: Crisis Management & Economic Policy

When writing this piece in July 2020, governments and central banks were confronting the peak economic paralysis of the pandemic lockdowns. In periods of extreme structural stress, the classic proverb proves true: *"In a crisis, everyone becomes a Keynesian."*

While theoretical models rightly demonstrate that money is neutral in the long run, **the short run matters immensely**. Unlocking credit, reducing interest rates, and providing liquidity prevents systemic insolvencies, keeps payrolls afloat, and averts deflationary depression.

Nonetheless, classical theory serves as an enduring reminder: once the shock subsides and economic output nears capacity, excessive unabsorbed liquidity inevitably manifests as inflation. Visualizing these trade-offs mathematically and computationally equips analysts with a clearer mental model of policy outcomes.
