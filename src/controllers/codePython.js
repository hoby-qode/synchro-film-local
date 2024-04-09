import re

# Fonction pour normaliser un titre de film
def normalize_title(title):
    # Convertir en minuscules
    normalized_title = title.lower()
    # Supprimer les caractères spéciaux
    normalized_title = re.sub(r'[^a-z0-9]', '', normalized_title)
    return normalized_title

# Fonction pour lire un fichier et extraire les titres des films
def extract_titles_from_file(file_path):
    titles = []
    with open(file_path, 'r', encoding='utf-8') as file:
        for line in file:
            # Ajouter le titre à la liste
            titles.append(line.strip())
    return titles

# Chemins des fichiers à comparer
file1_path = 'fichier1.txt'
file2_path = 'fichier2.txt'

# Extraire les titres des deux fichiers
titles1 = extract_titles_from_file(file1_path)
titles2 = extract_titles_from_file(file2_path)

# Normaliser les titres des deux fichiers
normalized_titles1 = [normalize_title(title) for title in titles1]
normalized_titles2 = [normalize_title(title) for title in titles2]

# Comparer les titres normalisés
matching_titles = set(normalized_titles1).intersection(normalized_titles2)

# Afficher les correspondances
print("Titres correspondants entre les deux fichiers :")
for title in matching_titles:
    print(title)
