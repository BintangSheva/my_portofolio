import pandas as pd
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans
from sklearn.preprocessing import MinMaxScaler
import warnings

warnings.filterwarnings('ignore')

# 1. Dataset 30 User (Pendapatan, Pengeluaran, Tabungan)
data_users = [
    [6500000, 4250000, 2250000],  # Icha
    [4000000, 3800000, 200000],   # Alfa
    [2000000, 1500000, 500000],   # Zidan
    [5000000, 4500000, 500000],   # Sony
    [6800000, 4400000, 2400000],  # Bima
    [7000000, 4500000, 2500000],  # Rara
    [6200000, 4100000, 2100000],  # Dika
    [6500000, 4300000, 2200000],  # Nisa
    [7200000, 4800000, 2400000],  # Reza
    [6000000, 3900000, 2100000],  # Tari
    [6900000, 4500000, 2400000],  # Gilang
    [7500000, 5000000, 2500000],  # Putri
    [4200000, 4000000, 200000],   # Kevin
    [4500000, 4350000, 150000],   # Siska
    [4000000, 3850000, 150000],   # Aldo
    [4800000, 4500000, 300000],   # Bella
    [4300000, 4100000, 200000],   # Rio
    [4600000, 4400000, 200000],   # Vina
    [2500000, 1800000, 700000],   # Bayu
    [2200000, 1600000, 600000],   # Rani
    [2800000, 2000000, 800000],   # Fajar
    [1800000, 1400000, 400000],   # Dinda
    [2400000, 1700000, 700000],   # Hadi
    [2100000, 1500000, 600000],   # Ayu
    [5200000, 4800000, 400000],   # Yoga
    [5000000, 4600000, 400000],   # Wulan
    [4800000, 4500000, 300000],   # Surya
    [5500000, 5100000, 400000],   # Intan
    [4900000, 4400000, 500000],   # Riko
    [5100000, 4700000, 400000]    # Maya
]

df = pd.DataFrame(data_users, columns=['Income', 'Expense', 'Savings'])

# 2. Normalisasi Data
scaler = MinMaxScaler()
df_scaled = scaler.fit_transform(df)

# 3. Hitung WCSS (Inertia) untuk K=1 sampai K=10
wcss = []
K_range = range(1, 11)

for k in K_range:
    kmeans = KMeans(n_clusters=k, init='k-means++', random_state=42)
    kmeans.fit(df_scaled)
    wcss.append(kmeans.inertia_)

# 4. Plot Kurva Elbow
plt.figure(figsize=(8, 5))
plt.plot(K_range, wcss, marker='o', linestyle='--', color='b')
plt.title('Evaluasi Model: The Elbow Method', fontsize=14)
plt.xlabel('Jumlah Cluster (K)', fontsize=12)
plt.ylabel('Nilai WCSS / Inertia', fontsize=12)
plt.xticks(K_range)
plt.grid(True, linestyle=':', alpha=0.7)

# Tandai titik siku (K=3)
plt.axvline(x=3, color='r', linestyle='-', alpha=0.5, label='Optimal K=3')
plt.legend()

# 5. Simpan gambar
plt.savefig('kurva_elbow.png', dpi=300, bbox_inches='tight')
print("Grafik Kurva Elbow berhasil disimpan sebagai 'kurva_elbow.png'")