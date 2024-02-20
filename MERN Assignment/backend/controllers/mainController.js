import axios from "axios";
import Product from "../models/product.js";

//Initialize Callback Function
export const initialize = async (req, res) => {
  try {
    const response = await axios.get(
      "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
    );
    const seedData = response.data;

    await Product.deleteMany({});

    // Inserting data into the Product collection in batches to avoid internal server error
    const batchSize = 20;
    for (let i = 0; i < seedData.length; i += batchSize) {
      const batch = seedData.slice(i, i + batchSize);
      await Product.insertMany(batch, { ordered: false });
    }

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
}

//Transactions Callback Function
export const transactions = async (req, res) => {
    try {
      const { search = "", page = 1, perPage = 10, month = "01" } = req.query;
      const regex = new RegExp(search, "i");
  
      const conditions = {
        $and: [
          {
            $or: [
              { title: { $regex: regex } },
              { description: { $regex: regex } },
            ],
          },
          {
            $expr: {
              $eq: [{ $month: "$dateOfSale" }, Number(month)],
            },
          },
        ],
      };
  
      const transactions = await Product.find(conditions)
        .skip((page - 1) * perPage)
        .limit(Number(perPage));
  
      res.json({ transactions });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
};

//Statistics Callback Function
export const statistics = async (req, res) => {
    try {
      const { month } = req.params;
     
      const result = await Product.aggregate([
        {
          $match: {
            "$expr": {
              "$eq": [
                { "$month": "$dateOfSale" },
                Number(month)
              ]
            }
          },
        },
        {
          $group: {
            _id: null,
            totalSaleAmount: { $sum: "$price" },
            totalSoldItems: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            totalSaleAmount: 1,
            totalSoldItems: 1,
            totalNotSoldItems: { $subtract: [60, "$totalSoldItems"] },
          },
        },
      ]);
  
      res.json(result[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

//BarChart Callback Function
export const barChart = async (req, res) => {
  try {
    const { month } = req.params;

    const result = await Product.aggregate([
      {
        $match: {
          "$expr": {
            "$eq": [
              { "$month": "$dateOfSale" },
              Number(month)
            ]
          }
        },
      },
      {
        $bucket: {
          groupBy: "$price",
          boundaries: [0, 100, 200, 300, 400, 500, 600, 700, 800, 900],
          default: "901-above",
          output: {
            count: { $sum: 1 },
          },
        },
      },
    ]);

    // Modify the data structure to include "price" property
    const formattedData = result.map((item, index) => ({
      price: index === result.length - 1 ? "901-above" : item._id.toString(),
      count: item.count,
    }));

    res.json(formattedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

//PieChart Callback Function
export const pieChart = async (req, res) => {
  try {
    const { month } = req.params;

    const result = await Product.aggregate([
      {
        $match: {
          "$expr": {
            "$eq": [
              { "$month": "$dateOfSale" },
              Number(month)
            ]
          }
        },
      },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ]);

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Combined Callback Function
export const Combine = async (req, res) => {
  try {
    const { month } = req.params;

    const transactions = await axios.get(`/transactions?search=&page=1&perPage=10`);
    const statistics = await axios.get(`/statistics/${month}`);
    const barChart = await axios.get(`/bar-chart/${month}`);
    const pieChart = await axios.get(`/pie-chart/${month}`);

    res.json({
      transactions: transactions.data,
      statistics: statistics.data,
      barChart: barChart.data,
      pieChart: pieChart.data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}