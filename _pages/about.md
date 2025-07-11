---
layout: about
title: about
permalink: /
subtitle: Shanghai Jiao Tong University. (zengzhi.wang [at] sjtu dot edu dot cn). 

profile:
  align: right
  image: sentosa_1.jpg
  image_circular: false # crops the image to make it circular
  more_info: >
    <p>We should dream big.</p>

selected_papers: true # includes a list of papers marked as "selected={true}"
social: true # includes social icons at the bottom of the page

announcements:
  enabled: true # includes a list of news items
  scrollable: true # adds a vertical scroll bar if there are more than 3 news items
  limit: 5 # leave blank to include all the news in the `_news` folder
  size: 7

latest_posts:
  enabled: false
  scrollable: true # adds a vertical scroll bar if there are more than 3 new posts items
  limit: 3 # leave blank to include all the blog posts
---

Hi, there! I am Zengzhi Wang (王增志), a first-year PhD student at [GAIR Lab](https://plms.ai/), Shanghai Jiao Tong University, advised by [Prof. Pengfei Liu](http://pfliu.com/). Before that, I received my master's degree in Computer Science at the Nanjing University of Science & Technology advised by Prof. Rui Xia and Assoc. Prof. Jianfei Yu. I obtained my bachelor's degree in Software Engineering at Wuhan Institute of Technology.


I curated data and trained models — and in turn, data, models, and results also trained me. My recent work mainly focuses on the following three aspects:
- **Building Domain-Specific (e.g., math) Corpora:** Creator of [MathPile](https://huggingface.co/datasets/GAIR/MathPile) (9.5B tokens, [NeurIPS 2024](https://openreview.net/pdf?id=RSvhU69sbG)) and [MegaMath](https://huggingface.co/datasets/LLM360/MegaMath) (> 370B tokens, [COLM 2025](https://arxiv.org/abs/2504.02807)), large-scale math-focused datasets designed to advance mathematical reasoning in language models.
- **General Pre-training Corpora Refinement:** Co-creator of [ProX](https://github.com/GAIR-NLP/ProX)([ICML 2025](https://arxiv.org/abs/2409.17115v2)), a scalable framework that leverages tiny language models to automatically refine large-scale corpora, along with refined byproducts, such as [FineWeb-Pro (100B tokens)](https://huggingface.co/datasets/gair-prox/FineWeb-pro) and [DCLM-Pro (>500B tokens)](https://huggingface.co/datasets/gair-prox/DCLM-pro). Check [Huggingface](https://huggingface.co/gair-prox) for more releases.
- **Data-centric Recipes for Building Foundation Models:** Initiator of [OctoThinker](https://github.com/GAIR-NLP/OctoThinker), unveiling the principles behind RL-friendly base language models and lifting foundation model capabilities through large-scale mid-training.

Currently, I’m exploring how to scale data quality and advance the scientific understanding of foundation language models.


<div style="display: flex; justify-content: center; gap: 20px;">
<img src="assets/img/research_roadmap.png" alt="Data Pipeline" style="width:80%;">
</div>