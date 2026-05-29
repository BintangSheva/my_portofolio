import sys
import json
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import silhouette_score, davies_bouldin_score
import warnings

warnings.filterwarnings('ignore')

try:
    input_data = sys.argv[1]
    transactions = json.loads(input_data)
except Exception as e:
    print(json.dumps({"error": "Gagal membaca data input", "details": str(e)}))
    sys.exit(1)

if not transactions:
    print(json.dumps({"cluster": "No Activity 💤", "ratio": 0}))
    sys.exit(0)

# ==========================================
# 1. AGREGASI DATA (3 Variabel Utama)
# ==========================================
df = pd.DataFrame(transactions)
df['amount'] = pd.to_numeric(df['amount'])

user_income = df[df['type'] == 'income']['amount'].sum()
user_expense = df[df['type'] == 'expense']['amount'].sum()
user_savings = max(0, user_income - user_expense)

if user_income == 0:
    saving_ratio = 0
else:
    saving_ratio = (user_savings / user_income) * 100

# ==========================================
# 2. DYNAMIC BASELINE DATASET (PERBAIKAN LOGIKA)
# ==========================================
# Kita bikin data patokan AI yang skalanya sama persis dengan gaji User!
# Jadi K-Means murni akan membandingkan GAYA HIDUP, bukan jumlah uangnya.
base_inc = user_income if user_income > 0 else 5000000

baseline_data = [
    # Hemat (Expense 20-30%)
    [base_inc, base_inc * 0.20, base_inc * 0.80],
    [base_inc, base_inc * 0.25, base_inc * 0.75],
    [base_inc, base_inc * 0.30, base_inc * 0.70],
    # Balanced (Expense 50-60%)
    [base_inc, base_inc * 0.50, base_inc * 0.50],
    [base_inc, base_inc * 0.55, base_inc * 0.45],
    [base_inc, base_inc * 0.60, base_inc * 0.40],
    # Boros (Expense 85-95%)
    [base_inc, base_inc * 0.85, base_inc * 0.15],
    [base_inc, base_inc * 0.90, base_inc * 0.10],
    [base_inc, base_inc * 0.95, base_inc * 0.05]
]

dataset = baseline_data + [[user_income, user_expense, user_savings]]
df_ml = pd.DataFrame(dataset, columns=['Income', 'Expense', 'Savings'])

# ==========================================
# 3. K-MEANS CLUSTERING & EVALUASI
# ==========================================
scaler = MinMaxScaler()
df_scaled = scaler.fit_transform(df_ml)

k = 3 
kmeans = KMeans(n_clusters=k, random_state=42, n_init=10)
clusters = kmeans.fit_predict(df_scaled)

sil_score = silhouette_score(df_scaled, clusters)
dbi_score = davies_bouldin_score(df_scaled, clusters)

# ==========================================
# 4. PENENTUAN LABEL
# ==========================================
user_cluster_id = clusters[-1]

df_ml['Cluster'] = clusters
df_ml['Expense_Ratio'] = df_ml['Expense'] / (df_ml['Income'] + 1)

# Urutkan dari rasio pengeluaran paling kecil (Hemat) ke besar (Boros)
cluster_ratios = df_ml.groupby('Cluster')['Expense_Ratio'].mean().sort_values()
sorted_cluster_ids = cluster_ratios.index.tolist()

if user_cluster_id == sorted_cluster_ids[0]:
    cluster_label = "Rich Saver 💎"
elif user_cluster_id == sorted_cluster_ids[1]:
    cluster_label = "Balanced ⚖️"
else:
    cluster_label = "Big Spender 🔥"

result = {
    "cluster": cluster_label,
    "ratio": int(saving_ratio),
    "income": int(user_income),
    "expense": int(user_expense),
    "savings": int(user_savings),
    "eval_metrics": {
        "silhouette_score": round(sil_score, 3),
        "davies_bouldin_index": round(dbi_score, 3)
    }
}

print(json.dumps(result))