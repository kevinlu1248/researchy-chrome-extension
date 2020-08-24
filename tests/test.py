from requests import post
TERMS = ["b16 melanoma adoptive transfer study", "many microbial pattern recognition receptors", "wounding supports tumor growth", "b16 melanoma adoptive transfer", "melanoma adoptive transfer study", "colonic epithelial cell toxin", "chronic inflammation augments tumorigenesis", "inflammation dependent tissue repair", "many microbial pattern recognition", "microbial pattern recognition receptors", "dysfunctional tumor suppressors", "unlimited replicative potential", "irreversible cellular changes", "tumor suppressor genes", "cell autonomous properties", "vascular endothelial cells", "infectious tissue damage", "worldwide cancer incidence", "human papilloma virus", "human herpes virus", "inappropriate immune responses", "inflammatory bowel disease", "many other cases", "subsequent inflammation predispose", "gene expression profile", "inflammatory gene expression", "spontaneous tumor formation", "familial adenomatous polyposis", "adaptive immune recognition", "various inflammatory cells", "high risk hpv", "host cell signaling", "chronic inflammatory states", "tumor suppressor pathways", "cell cycle arrest", "massive cell death", "infectious tissue injury", "undifferentiated precursor cells", "tissue stem cells", "proper functioning tissue", "many inflammatory pathways", "state proliferative compartment", "tissue repair process", "key supportive evidence", "dedicated tissue injury", "wounding supports tumor", "supports tumor growth", "rous sarcoma virus", "fibroblast growth factors", "melanoma adoptive transfer", "adoptive transfer study", "colonic epithelial cell", "epithelial cell toxin", "dextran sulfate sodium", "chronic inflammation augments", "inflammation augments tumorigenesis", "colonic epithelial cells", "intestinal epithelial injury", "epithelial cell survival", "chronic inflammation model", "hepatic epithelial cells", "many inflammatory mediators", "tumor cell proliferation", "fewer skin tumors", "epithelial cell death", "massive cellular death", "inflammation dependent tissue", "dependent tissue repair", "compensatory proliferative response", "physiologic tissue repair", "biological active form", "tumorigenic angiogenic switch", "later tumor growth", "spontaneous intestinal tumorigenesis", "intact regulatory mechanisms", "tissue repair factors", "countercurrent invasion theory", "microbial recognition pathways", "early tumor development", "such cell death", "enough cell death", "constant environmental insults", "low level irritation", "positive feedback loop", "many microbial pattern", "microbial pattern recognition", "pattern recognition receptors", "pattern recognition pathways", "genetic changes", "cancer cells", "sufficient growth", "death signals", "dysfunctional tumor", "tumor suppressors", "many aspects", "cancer development", "tumor promotion", "ancillary processes", "tumor environment", "reflexive relationship"]
STR_TERMS = "\n".join(TERMS)
URL = "https://tagger.jensenlab.org/GetEntities"
OPTIONS = {"document": STR_TERMS, "entity_types": "0 -1 -2 -21 -22 -23 -25 -26 -27", "format": "tsv", "autodetect": 0}
print("Posting...")
r = post(URL, OPTIONS)
print(r.text)

"""
cell cycle arrest	-21	GO:0007050
vascular endothelial cells	-25	BTO:0001854
gene expression	-21	GO:0010467
growth factors	-23	GO:0008083
cell death	-21	GO:0008219
growth factors	-22	GO:0036454
tumor suppressors	-21	GO:0051726
human	-2	9606
hpv	-2	10566
tumor suppressor	-21	GO:0051726
signaling	-21	GO:0023052
inflammatory bowel disease	-26	DOID:0050589
b16	3702	AT1G24120.1
b16	4932	YDR404C
intestinal epithelial	-25	BTO:0000781
immune responses	-21	GO:0006955
epithelial cell	-25	BTO:0000414
herpes virus	-2	39059
human papilloma virus	-2	10566
colonic epithelial cells	-25	BTO:0004297
inflammatory cells	-25	BTO:0003861
epithelial cells	-25	BTO:0000414
growth	-21	GO:0040007
fibroblast	-25	BTO:0000452
rous sarcoma virus	-2	11886
environment	-27	ENVO:01000254
cell proliferation	-21	GO:0008283
colonic epithelial cell	-25	BTO:0004297
pattern recognition receptors	-23	GO:0038187
melanoma	-26	DOID:1909
familial adenomatous polyposis	-26	DOID:0050424
"""
