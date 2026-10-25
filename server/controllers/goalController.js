import Goal from "../models/Goal.js";

// 1. AMBIL SEMUA MIMPI (Get)
export const getGoals = async (req, res) => {
  try {
    const { userId } = req.query;
    console.log("🔍 GET Goals Request untuk UserID:", userId); // Log request masuk

    const goals = await Goal.find({ userId: userId });
    console.log("✅ Berhasil ambil data goals:", goals.length, "items");
    
    res.status(200).json(goals);
  } catch (error) {
    console.error("❌ ERROR di getGoals:", error); // 👈 INI PENTING BIAR MUNCUL DI TERMINAL
    res.status(500).json({ message: error.message });
  }
};

// 2. BUAT MIMPI BARU (Create)
export const createGoal = async (req, res) => {
  console.log("🔥 MASUK createGoal! Data:", req.body); // Log data masuk

  const { userId, title, targetAmount, deadline, color, icon } = req.body;

  try {
    const newGoal = new Goal({
      userId, 
      title, 
      targetAmount, 
      currentAmount: 0, 
      deadline, 
      color, 
      icon
    });
    
    const savedGoal = await newGoal.save();
    console.log("💾 SUKSES Simpan ke Database:", savedGoal); // Log kalau sukses
    
    res.status(201).json(savedGoal);
  } catch (error) {
    console.error("❌ ERROR di createGoal:", error); // 👈 INI PENTING BIAR MUNCUL DI TERMINAL
    res.status(400).json({ message: error.message });
  }
};

// 3. UPDATE / NABUNG (Put)
export const updateGoal = async (req, res) => {
  try {
    const { currentAmount, addAmount } = req.body;
    //addAmount = Uang yang baru dimasukin (misal 50.000)

    // kalau cuma update data biasa (tanpa nabung), pakai logika lama
    if (addAmount === undifined ) {
      const updated = await Goal.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      return res.status(200).json(updated);
    }

    // kalau ada addAmount, berarti lagi nabung
    const goal = await Goal.findById(req.params.id);

    // update total
    goal.currentAmount = Number(goal.currentAmount) + Number(addAmount);

    // cata sejarah
    goal.history.push ({
      amount: Number(addAmount),
      date: new Date()
    });
    await goal.save(); // Simpan perubahan
    
    console.log(`📈 User nabung Rp ${addAmount}. Total skrg: ${goal.currentAmount}`);
    res.status(200).json(goal);

  } catch (error) {
    console.error("❌ ERROR di updateGoal:", error);
    res.status(400).json({ message: error.message });
  }
};

// 4. HAPUS MIMPI (Delete)
export const deleteGoal = async (req, res) => {
  try {
    await Goal.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Goal deleted successfully" });
  } catch (error) {
    console.error("❌ ERROR di deleteGoal:", error);
    res.status(500).json({ message: error.message });
  }
};