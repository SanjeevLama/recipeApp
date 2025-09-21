import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import RecipeList from "./components/RecipeList";
import RecipeDetail from "./components/RecipeDetail";
import Navbar from "./components/NavBar";
import Login from "./components/Login";
import Register from "./components/Register";
import CreateRecipe from "./components/createRecipe";
import EditRecipe from "./components/EditRecipe";
import Profile from './components/Profile'

function MainLayout() {
  return (
    <main className="max-w-4xl mx-auto p-4">
      <Outlet /> {/* This is where child routes render */}
    </main>
  );
}

function App() {
  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <Navbar />

      <Routes>
        {/* Routes with <main> */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<RecipeList />} />
          <Route path="/recipes/:id" element={<RecipeDetail />} />
          <Route path="/create-recipe" element={<CreateRecipe />} />
          <Route path="/recipes/:id/edit" element={<EditRecipe />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Routes without <main> */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}


export default App;
