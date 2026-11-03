---
dataset_info:
  features:
  - name: image
    dtype: image
  - name: label
    dtype:
      class_label:
        names:
          '0': '1'
          '1': '2'
          '2': '3'
          '3': '4'
          '4': '5'
          '5': '6'
          '6': '7'
          '7': '8'
          '8': '9'
          '9': A
          '10': B
          '11': C
          '12': D
          '13': E
          '14': F
          '15': G
          '16': H
          '17': I
          '18': J
          '19': K
          '20': L
          '21': M
          '22': N
          '23': O
          '24': P
          '25': Q
          '26': R
          '27': S
          '28': T
          '29': U
          '30': V
          '31': W
          '32': X
          '33': Y
          '34': Z
  splits:
  - name: train
    num_bytes: 253014091.95
    num_examples: 42745
  download_size: 292286969
  dataset_size: 253014091.95
configs:
- config_name: default
  data_files:
  - split: train
    path: data/train-*
---
# Dataset Card for "Indian_sign_language_dataset"

[More Information needed](https://github.com/huggingface/datasets/blob/main/CONTRIBUTING.md#how-to-contribute-to-the-dataset-cards)