---
title: 'Reevaluating BMI Standards for Health Equity'
subtitle: 'UMN Public Health Equity Data Challenge'
date: '2024-11-01'
description: 'Led a team using R, logistic regression, and Chi-Square analysis to demonstrate that BMI thresholds for hypertension and diabetes screening vary significantly across racial groups, proposing race-specific standards to improve health equity.'
tech:
  - R
  - Logistic Regression
  - Chi-Square Test
  - ggplot2
  - Public Health
featured: true
emoji: "\uD83C\uDFE5"
pdf: '/docs/projects/bmi-short-report.pdf'
---

## Background

BMI (Body Mass Index) is one of the most widely used tools for assessing health risk, especially for populations without easy access to comprehensive healthcare. However, current BMI standards apply uniform cutoffs across all racial groups, despite growing evidence that the relationship between BMI and disease risk varies significantly by ethnicity.

This project was part of the [UMN Public Health Equity Data Challenge](https://dsai-hub.umn.edu/events/join-umn-public-health-equity-data-challenge-sign-october-14), using the [Hennepin County SHAPE Survey](https://www.hennepincounty.gov/government/about/research-data) dataset.

## Methods

Using the 2022 Hennepin County SHAPE Survey data, we examined the relationship between BMI, race, and chronic disease prevalence (hypertension and diabetes):

1. **Data Cleaning** -- Excluded pregnant individuals, outlier BMIs (< 12 or > 50), and missing values. Final sample: 186 AIAN, 201 Hispanic, 180 Asian, 543 Black, and 3,198 White participants.

2. **Logistic Regression** -- Fitted models with gender, age, and race as controls, confirming a significant positive correlation between BMI and both hypertension and diabetes (all p-values < 0.05).

3. **Box-Plot Analysis** -- Compared BMI distributions of diseased individuals across racial groups, revealing that Asian populations consistently display lower BMI values for both conditions.

4. **Threshold Recalibration** -- Defined race-specific BMI thresholds using an 85th percentile criterion (the BMI at which 85% of diseased individuals in each racial group have a BMI at or above that level).

## Key Findings

|                  | AIAN | Hispanic | Asian | Black | White |
| ---------------- | ---- | -------- | ----- | ----- | ----- |
| **Hypertension** | 25.1 | 25.8     | 22.0  | 24.0  | 23.6  |
| **Diabetes**     | 25.8 | 25.7     | 21.9  | 24.7  | 24.4  |

- Asian populations show significantly lower BMI thresholds (21.9--22.0) compared to the standard cutoff of 25, meaning the current standard may miss at-risk Asian individuals.
- Using White individuals (BMI 25) as a benchmark, the equivalent diabetes screening threshold for Asians is approximately 18.75.
- The predictive value of BMI for disease based on race appears to be primary, largely stemming from racial physical characteristics rather than indirect lifestyle factors.

## Impact

This recalibration significantly improved screening accuracy for high-risk individuals across racial groups. Our work advocates for adopting race-specific BMI thresholds to promote health equity, ensuring that underserved communities receive timely and culturally sensitive healthcare interventions.

## Authors

Baojia Chen, Chujun Fu, Jingcheng Liang, and Xun Lu (equal contribution).
