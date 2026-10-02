import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [foodItems, setFoodItems] = useState(() => {
  const savedFood = localStorage.getItem("foodItems");
  return savedFood ? JSON.parse(savedFood) : [];
});

  const [foodName, setFoodName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [location, setLocation] = useState("");
  const [donorName, setDonorName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [category, setCategory] = useState("Grains");
  const [expiryDate, setExpiryDate] = useState("");
  const [status, setStatus] = useState("Available");

  const [search, setSearch] = useState("");
const [statusFilter, setStatusFilter] = useState("All");
const [editId, setEditId] = useState(null);

useEffect(() => {
  localStorage.setItem(
    "foodItems",
    JSON.stringify(foodItems)
  );
}, [foodItems]);

const addFood = () => {
    if (!foodName || !quantity || !location || !expiryDate) {
      alert("Please fill Food Name, Quantity, Location and Expiry Date.");
      return;
    }
if (contactNumber && contactNumber.length !== 10) {
  alert("Contact Number must be exactly 10 digits.");
  return;
}    

    if (editId !== null) {
  setFoodItems(
    foodItems.map((food) =>
      food.id === editId
        ? {
            ...food,
            foodName,
            quantity,
            location,
            donorName,
            contactNumber,
            category,
            expiryDate,
            status,
          }
        : food
    )
  );

  setEditId(null);
} else {
  const newFood = {
    id: Date.now(),
    foodName,
    quantity,
    location,
    donorName,
    contactNumber,
    category,
    expiryDate,
    status,
  };

  setFoodItems([...foodItems, newFood]);
}

    setFoodName("");
    setQuantity("");
    setLocation("");
    setDonorName("");
    setContactNumber("");
    setCategory("Grains");
    setExpiryDate("");
    setStatus("Available");
  };

  const deleteFood = (id) => {
    setFoodItems(foodItems.filter((food) => food.id !== id));
  };

  const editFood = (food) => {
  setFoodName(food.foodName);
  setQuantity(food.quantity);
  setLocation(food.location);
  setDonorName(food.donorName);
  setContactNumber(food.contactNumber);
  setCategory(food.category);
  setExpiryDate(food.expiryDate);
  setStatus(food.status);

  setEditId(food.id);
};

  // Dashboard calculations
  const foodCount = foodItems.length;

  const totalQuantity = foodItems.reduce((total, food) => {
    const number = parseFloat(food.quantity);
    return total + (isNaN(number) ? 0 : number);
  }, 0);

  const locations = new Set(
    foodItems.map((food) => food.location.trim().toLowerCase())
  );

  const categories = new Set(foodItems.map((food) => food.category));

  const today = new Date();

  const expiringCount = foodItems.filter((food) => {
    if (!food.expiryDate) return false;

    const expiry = new Date(food.expiryDate);
    const difference =
      (expiry - today) / (1000 * 60 * 60 * 24);

    return difference >= 0 && difference <= 7;
  }).length;

  // Category counts
  const grainsCount = foodItems.filter(
    (food) => food.category === "Grains"
  ).length;

  const vegetablesCount = foodItems.filter(
    (food) => food.category === "Vegetables"
  ).length;

  const fruitsCount = foodItems.filter(
    (food) => food.category === "Fruits"
  ).length;

  const dairyCount = foodItems.filter(
    (food) => food.category === "Dairy"
  ).length;

  const bakeryCount = foodItems.filter(
    (food) => food.category === "Bakery"
  ).length;

  const otherCount = foodItems.filter(
    (food) => food.category === "Other"
  ).length;

  // Status counts
  const availableCount = foodItems.filter(
    (food) => food.status === "Available"
  ).length;

  const donatedCount = foodItems.filter(
    (food) => food.status === "Donated"
  ).length;

  const expiredCount = foodItems.filter(
    (food) => food.status === "Expired"
  ).length;

  const chartData = {
  labels: [
    "Grains",
    "Vegetables",
    "Fruits",
    "Dairy",
    "Bakery",
    "Other",
  ],
  datasets: [
    {
      data: [
        grainsCount,
        vegetablesCount,
        fruitsCount,
        dairyCount,
        bakeryCount,
        otherCount,
      ],
      backgroundColor: [
        "#FFD54F",
        "#66BB6A",
        "#EF5350",
        "#42A5F5",
        "#AB47BC",
        "#78909C",
      ],
      borderColor: "#ffffff",
      borderWidth: 2,
    },
  ],
};

  // Search + filter
  const filteredFood = foodItems.filter((food) => {
    const matchesSearch = food.location
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      food.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <>
      {/* HEADER */}

      <header className="app-header">
        <div className="header-content">

          <div className="logo-section">

            <div className="logo-icon">
              SFW
            </div>

            <div>
              <h1>
                Smart Food Waste Reduction System
              </h1>

              <p>
                Manage food. Reduce waste. Help people.
              </p>
            </div>

          </div>

          <div className="header-badge">
            Sustainable Food Management
          </div>

        </div>
      </header>


      {/* MAIN CONTAINER */}

      <div className="container">

        {/* DASHBOARD */}

        <div className="dashboard">

          <div className="dashboard-card">
            <div className="card-icon">FOOD</div>

            <h3>{foodCount}</h3>

            <p>Food Items</p>
          </div>


          <div className="dashboard-card">
            <div className="card-icon">QTY</div>

            <h3>{totalQuantity}</h3>

            <p>Total Quantity</p>
          </div>


          <div className="dashboard-card">
            <div className="card-icon">TIME</div>

            <h3>{expiringCount}</h3>

            <p>Expiring Soon</p>
          </div>


          <div className="dashboard-card">
            <div className="card-icon">LOC</div>

            <h3>{locations.size}</h3>

            <p>Locations</p>
          </div>


          <div className="dashboard-card">
            <div className="card-icon">CAT</div>

            <h3>{categories.size}</h3>

            <p>Categories</p>
          </div>

        </div>


        {/* CATEGORY BREAKDOWN */}

        <div className="category-breakdown">

          <h2>
            Category Breakdown
          </h2>

          <div id="categoryList">

            <div className="category-item">
              <span>🌾 Grains</span>
              <strong>{grainsCount}</strong>
            </div>

            <div className="category-item">
              <span>🥦 Vegetables</span>
              <strong>{vegetablesCount}</strong>
            </div>

            <div className="category-item">
              <span>🍎 Fruits</span>
              <strong>{fruitsCount}</strong>
            </div>

            <div className="category-item">
              <span>🥛 Dairy</span>
              <strong>{dairyCount}</strong>
            </div>

            <div className="category-item">
              <span>🍞 Bakery</span>
              <strong>{bakeryCount}</strong>
            </div>

            <div className="category-item">
              <span>📦 Other</span>
              <strong>{otherCount}</strong>
            </div>

          </div>
        </div>


        {/* FOOD STATUS SUMMARY */}

        <div className="status-summary">

          <h2>
            Food Status Summary
          </h2>

          <div className="status-list">

            <div className="status-card">
              <span>🟢 Available</span>
              <strong>{availableCount}</strong>
            </div>

            <div className="status-card">
              <span>🤝 Donated</span>
              <strong>{donatedCount}</strong>
            </div>

            <div className="status-card">
              <span>🔴 Expired</span>
              <strong>{expiredCount}</strong>
            </div>

          </div>
        </div>

        <div className="analytics-section">
  <h2>Food Category Analytics</h2>

  <div
    style={{
      width: "350px",
      margin: "20px auto",
    }}
  >
    <Pie
  data={chartData}
  options={{
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  }}
/>
  </div>
</div>


        {/* ADD FOOD FORM */}

        <div className="form-section">

          <h2>
            Add Food
          </h2>

          <input
            type="text"
            placeholder="Food Name"
            value={foodName}
            onChange={(e) => setFoodName(e.target.value)}
          />

          <input
            type="text"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />

          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <input
            type="text"
            placeholder="Donor Name"
            value={donorName}
            onChange={(e) => setDonorName(e.target.value)}
          />

          <input
  type="tel"
  placeholder="Contact Number"
  value={contactNumber}
  maxLength="10"
  onChange={(e) =>
    setContactNumber(
      e.target.value.replace(/\D/g, "")
    )
  }
/>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Grains">Grains</option>
            <option value="Vegetables">Vegetables</option>
            <option value="Fruits">Fruits</option>
            <option value="Dairy">Dairy</option>
            <option value="Bakery">Bakery</option>
            <option value="Other">Other</option>
          </select>

          <input
            type="date"
            value={expiryDate}
            onChange={(e) =>
              setExpiryDate(e.target.value)
            }
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Available">Available</option>
            <option value="Donated">Donated</option>
            <option value="Expired">Expired</option>
          </select>

          <button
            type="button"
            onClick={addFood}
          >
            {editId !==null
              ?"Update Food"
              :"Add Food"}
          </button>    


          <h3>
            Total Food Items:{" "}
            <span id="foodCountDisplay">
              {foodCount}
            </span>
          </h3>


          {/* SEARCH */}

          <input
            type="text"
            id="searchBox"
            placeholder="Search by location"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />


          {/* STATUS FILTER */}

          <label
            htmlFor="statusFilter"
            style={{
              display: "block",
              maxWidth: "500px",
              margin: "20px auto 8px",
              fontWeight: "bold",
              color: "#1b5e20",
            }}
          >
            Filter by Status
          </label>

          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
          >
            <option value="All">
              All Food
            </option>

            <option value="Available">
              Available
            </option>

            <option value="Donated">
              Donated
            </option>

            <option value="Expired">
              Expired
            </option>
          </select>


          {/* FOOD LIST */}

          <h2>
            Available Food
          </h2>

          <ul id="foodList">

            {filteredFood.length === 0 ? (
              <li>
                No food items found.
              </li>
            ) : (
              filteredFood.map((food) => (
                <li key={food.id}>

                  <strong>
                    {food.foodName}
                  </strong>

                  <br />

                  Quantity: {food.quantity}

                  <br />

                  Location: {food.location}

                  <br />

                  Donor: {food.donorName || "N/A"}

                  <br />

                  Contact: {food.contactNumber || "N/A"}

                  <br />

                  Category: {food.category}

                  <br />

                  Expiry Date: {food.expiryDate}

                  <br />

                  Status: {food.status}

                  <button
  type="button"
  onClick={() => editFood(food)}
>
  Edit
</button>
                  <button
                    type="button"
                    onClick={() =>
                      deleteFood(food.id)
                    }
                  >
                    Delete
                  </button>

                </li>
              ))
            )}

          </ul>

        </div>

      </div>
    </>
  );
}

export default App;