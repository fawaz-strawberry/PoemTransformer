import torch
import torch.nn as nn
import torch.optim as optim
import spacy

from torch.utils.tensorboard import SummaryWriter
from torchtext.datasets import Multi30k
from torchtext.data import Field, BucketIterator