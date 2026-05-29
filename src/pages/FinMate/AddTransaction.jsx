import React from "react";

// TERIMA 3 PROPS DARI DASHBOARD
const AddTransaction = ({ onSubmit, newTransaction, setNewTransaction }) => {

  // Fungsi buat nanganin ketikan user
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTransaction((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">➕ Tambah Transaksi Baru</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
        
        {/* 1. INPUT NAMA */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-500 mb-1">Keterangan</label>
          <input
            type="text"
            name="name"
            placeholder="Contoh: Gaji Bulanan"
            value={newTransaction.name} // Ambil value dari props
            onChange={handleChange}     // Panggil fungsi handleChange
            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* 2. INPUT JUMLAH (AMOUNT) */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-500 mb-1">Jumlah (Rp)</label>
          <input
            type="number"
            name="amount"
            placeholder="0"
            value={newTransaction.amount}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* 3. INPUT KATEGORI */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-500 mb-1">Kategori</label>
          <select
            name="category"
            value={newTransaction.category}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
          >
            <option value="">Pilih Kategori</option>
            <option value="Food">Makan/Minum</option>
            <option value="Transport">Transportasi</option>
            <option value="Entertainment">Hiburan</option>
            <option value="Utilities">Tagihan</option>
            <option value="Salary">Gaji</option>
            <option value="Other">Lainnya</option>
          </select>
        </div>

        {/* 4. INPUT TIPE (INCOME/EXPENSE) */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-500 mb-1">Tipe</label>
          <select
            name="type"
            value={newTransaction.type}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
          >
            <option value="expense">Pengeluaran (Expense)</option>
            <option value="income">Pemasukan (Income)</option>
          </select>
        </div>

        {/* 5. INPUT TANGGAL */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-500 mb-1">Tanggal</label>
          <input
            type="date"
            name="date"
            value={newTransaction.date}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

      </div>

      {/* TOMBOL SIMPAN */}
      <button
        onClick={onSubmit} // Panggil fungsi dari Dashboard
        className="mt-4 w-full md:w-auto bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition duration-200 font-medium"
      >
        Simpan Transaksi
      </button>
    </div>
  );
};

export default AddTransaction;