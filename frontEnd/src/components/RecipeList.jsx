import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import fill_heart from "../assets/fill_heart.png";
import api from '../api'
import { CATEGORIES, DIET_TYPES } from "../constants";

const placeholderImages = [
  '/recipe_1.png',
  '/recipe_2.png',
  '/recipe_3.png',
];

function RecipeList() {
  // useState hook for memory
  const [paginationData, setPaginationData] = useState({
    results: [],
    count: 0,
    next: null,
    previous: null,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [debounceSearchTerm, setDebounceSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDietType, setSelectedDietType] = useState("");
  const [sortBy, setSortBy] = useState("-like_count_ann");

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebounceSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);

  // useEffect hook to fetch data when component loads
  useEffect(() => {
    const params = new URLSearchParams();

    if (debounceSearchTerm) {
      params.append("search", debounceSearchTerm);
    }
    if (selectedCategory) {
      params.append("category", selectedCategory);
    }
    if (selectedDietType) {
      params.append("diet_type", selectedDietType);
    }
    if (sortBy) {
      params.append("ordering", sortBy);
    }

    const queryString = params.toString();
    const url = `/api/recipes/?${queryString}`;

    // call the fetch function
    fetchRecipes(url);
  }, [debounceSearchTerm, selectedCategory, selectedDietType, sortBy]);

  const fetchRecipes = async (url) => {
    try {
      const response = await api.get(url);
      setPaginationData(response.data); // use setter to set the value of state
    } catch (error) {
      console.error("Error fetching recipes: ", error);
    }
  };

  const getPageNumber = (url) => {
    if (!url) return 1; // default if no url
    try {
      const parsed = new URL(url);
      const page = parsed.searchParams.get("page");
      return page ? Number(page) : 1;
    } catch {
      return 1;
    }
  }

  const handleNextPage = () => {
    if (paginationData.next) {
      fetchRecipes(paginationData.next);
    }
  }

  const handlePreviousPage = () => {
    if (paginationData.previous) {
      fetchRecipes(paginationData.previous);
    }
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">All Recipes</h1>

      {/* Search Bar Container */}
      <div className="mb-4">
        <input
          name="search"
          type="text"
          placeholder="Search for recipes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          // We can reuse our form input styling here!
          className="w-full max-w-sm px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        {/* category filters */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((category) => (
            <button
              key={category.code}
              onClick={() => setSelectedCategory(category.code)}
              className={`py-2 px-4 rounded-full text-sm font-medium transition-colors ${selectedCategory === category.code
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* diet type */}
        <div className="flex flex-wrap gap-2">
          {DIET_TYPES.map((diet) => (
            <button
              key={diet.code}
              onClick={() => setSelectedDietType(diet.code)}
              className={`py-2 px-3 rounded-md text-sm font-medium transition-colors ${selectedDietType === diet.code
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
            >
              {diet.name}
            </button>
          ))}
        </div>

        {/* sort by dropdown */}
        <div>

          <select
            id="sort-by"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="-like_count_ann">Most Popular</option>
            <option value="like_count_ann">Least Popular</option>
            <option value="-created_at">Newest</option>
            <option value="created_at">Oldest</option>
          </select>
        </div>
      </div>

      {/* Recipe Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginationData.results.map((recipe, index) => { // Get the index of the recipe in the array

          // The modulo operator (%) ensures the result is always 0, 1, or 2
          const imageUrl = placeholderImages[index % placeholderImages.length];

          return (
            <Link to={`/recipes/${recipe.id}`} key={recipe.id} className="block">
              {/* Added a group class for hover effects */}
              <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden h-full flex flex-col group">

                {/* ADD THE IMAGE TAG */}
                <div className="relative">
                  <img
                    src={imageUrl}
                    alt={recipe.title}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                <div className="p-4 flex-grow">
                  <h2 className="text-xl font-semibold text-gray-800 truncate">{recipe.title}</h2>
                  <p className="text-gray-600 mt-2 text-sm">by {recipe.owner}</p>
                </div>
                <div className="flex justify-end gap-2 p-4 bg-gray-50 border-t border-gray-100">
                  <p className="text-sm font-medium text-gray-700">
                    {recipe.like_count}
                  </p>
                  <img src={fill_heart} alt="fill heart" width={25} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* pagination control */}
      <div className="flex justify-center items-center space-x-4 mt-8">
        <button onClick={handlePreviousPage} disabled={!paginationData.previous} className="py-2 px-4 bg-blue-500 text-white rounded disabled:bg-gray-300">Previous</button>
        <span className="text-gray-700">Page {paginationData.previous ? getPageNumber(paginationData.previous) + 1 : 1} of {paginationData.count > 0 ? Math.ceil(paginationData.count / paginationData.results.length) : 1}</span>
        <button
          onClick={handleNextPage}
          disabled={!paginationData.next} // Disable if there's no next page
          className="py-2 px-4 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default RecipeList;
