import React, { useState, useEffect, use } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import fill_heart from "../assets/fill_heart.png";
import api from '../api';
import { CATEGORIES, DIET_TYPES } from '../constants';

function RecipeDetail() {
  // get id from url
  const { id } = useParams();
  const { user, authToken } = useAuth();
  const navigate = useNavigate();

  // set up state for recipe
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);

        const response = await api.get(
          `/api/recipes/${id}/`);
        setRecipe(response.data);
      } catch (error) {
        console.error("Error fetching recipe: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id, authToken]); // Also add authToken as a dependency

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this recipe?")) {
      try {
        const response = await api.delete(
          `/api/recipes/${id}/`);
        navigate("/");
      } catch (error) {
        console.error("Error deleting recipe:", error);
        alert("Error: " + error.message);
      }
    }
  };

  const handleLikeToggle = async () => {
    if (!user) {
      alert("You must be logged in to like a recipe.");
      navigate("/login");
      return;
    }

    try {
      const response = await api.post(
        `/like/recipes/${id}/`);

      setRecipe((prev) => ({
        ...prev,
        like_count: prev.user_has_liked
          ? prev.like_count - 1
          : prev.like_count + 1,
        user_has_liked: !prev.user_has_liked,
      }));
    } catch (error) {
      console.error("Error toggling like:", error);
      alert("Error: " + error.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!recipe) {
    return <div>Recipe not found.</div>;
  }

  const isOwner = user && user.username === recipe.owner;
  const categoryName = CATEGORIES.find(c => c.code === recipe?.category)?.name ?? recipe?.category;
  const dietTypeName = DIET_TYPES.find(d => d.code === recipe?.diet_type)?.name ?? recipe?.diet_type;


  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-md">
      {/* Header section with Back link and Title */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{recipe.title}</h1>
          <p className="text-sm text-gray-500 mt-1">by {recipe.owner}</p>
        </div>
        <Link
          to="/"
          className="text-blue-600 hover:text-blue-800 whitespace-nowrap"
        >
          &larr; Back to Recipes
        </Link>
      </div>

      {/* Owner controls and Likes */}
      <div className="flex items-center justify-between border-t border-b border-gray-200 py-3 my-4">
        {/* Like Button */}
        <div className="flex items-center">
          <button
            onClick={handleLikeToggle}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            {recipe.user_has_liked ? "Unlike" : "Like"}
          </button>
          <div className="flex gap-2">
            <p className="ml-4 text-gray-600 font-medium">{recipe.like_count}</p>
            <img src={fill_heart} alt="fill heart" width={25} />
          </div>

        </div>
        {/* Edit/Delete Buttons */}
        {isOwner && (
          <div className="flex space-x-2">
            <Link to={`/recipes/${id}/edit`}>
              <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">
                Edit
              </button>
            </Link>
            <button
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* TAGS/PILLS DISPLAY */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">
          {categoryName}
        </span>
        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full">
          {dietTypeName}
        </span>
      </div>

      {/* Main Recipe Content */}
      <div className="space-y-6">
        {recipe.description && (
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Description
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {recipe.description}
            </p>
          </div>
        )}

        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Ingredients
          </h3>
          <pre className="text-gray-700 bg-gray-50 p-4 rounded-md whitespace-pre-wrap font-sans">
            {recipe.ingredients}
          </pre>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Instructions
          </h3>
          <pre className="text-gray-700 bg-gray-50 p-4 rounded-md whitespace-pre-wrap font-sans">
            {recipe.instructions}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default RecipeDetail;
