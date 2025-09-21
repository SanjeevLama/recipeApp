import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import fill_heart from "../assets/fill_heart.png";

const placeholderImages = [
    '/recipe_1.png',
    '/recipe_2.png',
    '/recipe_3.png',
];

function Profile() {
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState();

    const [sortBy, setSortBy] = useState('likes');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const response = await api.get("api/profile/");
                setProfileData(response.data);
            } catch (error) {
                console.error("Error fetching profile data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const sortedRecipes = useMemo(() => {
        if (!profileData?.recipes) {
            return [];
        }

        const recipesToSort = [...profileData.recipes];

        if (sortBy === 'likes') {
            recipesToSort.sort((a, b) => b.like_count - a.like_count);
        } else if (sortBy == 'newest') {
            recipesToSort.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        }

        return recipesToSort;
    }, [profileData, sortBy]);

    if (loading) {
        return <div className="text-center mt-10">Loading profile...</div>;
    }

    if (!profileData) {
        return (
            <div className="text-center mt-10">
                Could not load profile. Are you logged in?
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Profile Header */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-3xl font-bold text-gray-800">
                    {profileData.username}
                </h1>
                <p className="text-gray-600">{profileData.email}</p>

                <div className="border-t border-gray-200 pt-4">
                    <dl className="flex space-x-6 text-center"> {/* Use space-x for spacing */}
                        {/* Total Recipes Stat */}
                        <div className="flex flex-col">
                            <dt className="text-sm font-medium text-gray-500">Total Recipes</dt>
                            <dd className="mt-1 text-2xl font-semibold text-gray-900">
                                {profileData.recipes.length}
                            </dd>
                        </div>

                        {/* THIS IS THE NEW PART */}
                        <div className="flex flex-col">
                            <dt className="text-sm font-medium text-gray-500">Total Likes</dt>
                            <dd className="mt-1 text-2xl font-semibold text-gray-900">
                                {profileData.total_likes_received}
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>

            {/* User's Recipes Section */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">My Recipes</h2>

                    {/* 5. ADD THE SORT DROPDOWN */}
                    {profileData.recipes && profileData.recipes.length > 0 && (
                        <div>
                            <select
                                name="sort-by"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="likes">Most Popular</option>
                                <option value="newest">Newest</option>
                            </select>
                        </div>
                    )}
                </div>
                {profileData.recipes && profileData.recipes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sortedRecipes.map((recipe, index) => { // 2. Get the index

                            // 3. Assign the image using the same modulo logic
                            const imageUrl = placeholderImages[index % placeholderImages.length];

                            return (
                                <Link to={`/recipes/${recipe.id}`} key={recipe.id} className="block">
                                    {/* Reusing the exact same card structure and classes */}
                                    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden h-full flex flex-col group">

                                        {/* 4. ADD THE IMAGE TAG */}
                                        <div className="relative">
                                            <img
                                                src={imageUrl}
                                                alt={recipe.title}
                                                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        </div>

                                        <div className="p-4 flex-grow">
                                            <h3 className="text-lg font-semibold text-gray-800 truncate">{recipe.title}</h3>
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
                ) : (
                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                        <p className="text-gray-600">You haven't posted any recipes yet.</p>
                        <Link
                            to="/create-recipe"
                            className="mt-4 inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                        >
                            Create Your First Recipe
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Profile;
