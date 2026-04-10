// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { useForm } from "react-hook-form";
// import HamburgerMenu from "../components/Hamburgermenu";
// import signupBg from "../assets/homepage-bg2.jpg";
// import { useAppDispatch, useAppSelector } from "../redux/hooks";
// import { registerUser } from "../redux/slices/authSlice";
// import { showToast } from "../redux/slices/uiSlice";

// const SignupPage = () => {
//   const navigate = useNavigate();
//   const { register, handleSubmit } = useForm();
//   const dispatch = useAppDispatch();
//   const { isLoading, error } = useAppSelector((state) => state.auth);

//   const onSubmit = async (data) => {
//     try {
//       await dispatch(registerUser(data)).unwrap();
//       dispatch(showToast({ message: "Account created successfully!", type: "success" }));
//       navigate("/login");
//     } catch (err) {
//       dispatch(showToast({ message: err.message || "Signup failed.", type: "error" }));
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col bg-gray-50">
//       <nav className="flex justify-between items-center px-6 py-4 w-full bg-white shadow-md z-10">
//         <div className="flex items-center gap-x-4">
//           <HamburgerMenu />
//           <a href="/" className="text-2xl flex items-center">
//             <span className="font-normal text-gray-900">Uber</span>
//             <span className="font-bold text-green-600 ml-1">Eats</span>
//           </a>
//         </div>
//         <div className="flex items-center space-x-3">
//           <a href="/login" className="px-5 py-2 text-gray-700 font-medium hover:text-gray-900 transition duration-300">
//             Log in
//           </a>
//           <a href="/signup" className="px-5 py-2 bg-green-600 text-white rounded-lg transition duration-300 hover:bg-green-700 font-medium">
//             Sign up
//           </a>
//         </div>
//       </nav>

//       <div className="flex flex-grow">
//         <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12">
//           <div className="w-full max-w-md">
//             <div className="mb-6">
//               <h1 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h1>
//               <p className="text-gray-600">Join thousands of food lovers today!</p>
//             </div>
//             <div className="bg-white rounded-xl shadow-sm p-8">
//               {error && (
//                 <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
//                   <p className="text-red-700">{error}</p>
//                 </div>
//               )}
//               <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//                 <div>
//                   <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
//                   <input
//                     {...register("name", { required: true })}
//                     placeholder="Enter your full name"
//                     className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-gray-700 font-semibold mb-2">Email</label>
//                   <input
//                     {...register("email", { required: true })}
//                     type="email"
//                     placeholder="your.email@example.com"
//                     className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-gray-700 font-semibold mb-2">Password</label>
//                   <input
//                     {...register("password", { required: true })}
//                     type="password"
//                     placeholder="Create a password"
//                     className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//                   />
//                 </div>
//                 <button
//                   type="submit"
//                   disabled={isLoading}
//                   className={`w-full py-3 rounded-lg text-white font-semibold ${isLoading ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"} transition-colors`}
//                 >
//                   {isLoading ? "Creating account..." : "Sign up"}
//                 </button>
//               </form>
//               <p className="mt-6 text-center text-gray-600">
//                 Already have an account? <a href="/login" className="text-green-600 hover:text-green-700">Log in</a>
//               </p>
//             </div>
//           </div>
//         </div>
//         <div className="hidden lg:block w-1/2 relative overflow-hidden">
//           <div
//             className="absolute inset-0 bg-cover bg-center"
//             style={{ backgroundImage: `url(${signupBg})` }}
//           ></div>
//           <div className="absolute inset-0 bg-gradient-to-tr from-green-900/80 via-green-800/60 to-black/50"></div>
//           <div className="relative h-full flex flex-col justify-center px-12 z-10">
//             <div className="max-w-lg">
//               <div className="mb-6 inline-block">
//                 <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg text-white text-sm font-medium">
//                   Join the community
//                 </div>
//               </div>
//               <h2 className="text-4xl font-bold text-white mb-4">Discover the best food from local restaurants</h2>
//               <p className="text-xl text-gray-100 mb-8">Create an account to order your favorite meals and get exclusive deals.</p>
//               <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl mt-8 border border-white/20">
//                 <div className="flex items-center mb-4">
//                   <div className="w-12 h-12 rounded-full bg-green-200 flex items-center justify-center mr-4">
//                     <span className="text-green-700 font-bold">JD</span>
//                   </div>
//                   <div>
//                     <h4 className="text-white font-medium">Mickey Latte</h4>
//                     <p className="text-gray-200 text-sm">Food Enthusiast</p>
//                   </div>
//                 </div>
//                 <p className="text-gray-100 italic">
//                   "I've been using Uber Eats for over a year now. The variety of restaurants and quick delivery times make it my go-to food delivery app!"
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignupPage;

import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import HamburgerMenu from "../components/Hamburgermenu";
import signupBg from "../assets/homepage-bg2.jpg";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { registerUser } from "../redux/slices/authSlice";
import { showToast } from "../redux/slices/uiSlice";

// Create a Signup component (moved from inline to a component)
const Signup = () => {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const onSubmit = async (data) => {
    try {
      await dispatch(registerUser(data)).unwrap();
      dispatch(showToast({ message: "Account created successfully!", type: "success" }));
      navigate("/login");
    } catch (err) {
      dispatch(showToast({ message: err.message || "Signup failed.", type: "error" }));
    }
  };

  return (
    <div className="p-8">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
          <input
            {...register("name", { required: true })}
            placeholder="Enter your full name"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Email</label>
          <input
            {...register("email", { required: true })}
            type="email"
            placeholder="your.email@example.com"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Password</label>
          <input
            {...register("password", { required: true })}
            type="password"
            placeholder="Create a password"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 rounded-lg text-white font-semibold ${isLoading ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 text-gray-900"} transition-colors`}
        >
          {isLoading ? "Creating account..." : "Sign up"}
        </button>
      </form>
      <p className="mt-6 text-center text-gray-600">
        Already have an account? <a href="/login" className="text-green-600 hover:text-green-700 text-gray-900">Log in</a>
      </p>
    </div>
  );
};

const SignupPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Enhanced Navbar */}
      <nav className="flex justify-between items-center px-6 py-4 w-full bg-white shadow-md z-10">
        <div className="flex items-center gap-x-4">
          <HamburgerMenu />
          <a href="/" className="text-2xl flex items-center">
            <span className="font-normal text-gray-900">Uber</span>
            <span className="font-bold text-green-600 ml-1">Eats</span>
          </a>
        </div>
        
        <div className="flex items-center space-x-3">
          <a href="/login" className="px-5 py-2 text-gray-700 font-medium hover:text-gray-900 transition duration-300">
            Log in
          </a>
          <a href="/signup" className="px-5 py-2 bg-green-600 text-white rounded-lg transition duration-300 hover:bg-green-700 font-medium">
            Sign up
          </a>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex flex-grow">
        {/* Left Panel - Signup Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12">
          <div className="w-full max-w-md">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h1>
              <p className="text-gray-600">Join thousands of food lovers today!</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm">
              <Signup />
            </div>
          </div>
        </div>
        
        {/* Right Panel - Background Image with Content */}
        <div className="hidden lg:block w-1/2 relative overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${signupBg})` }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-green-900/80 via-green-800/60 to-black/50"></div>
          
          <div className="relative h-full flex flex-col justify-center px-12 z-10">
            <div className="max-w-lg">
              <div className="mb-6 inline-block">
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg text-white text-sm font-medium">
                  Join the community
                </div>
              </div>
              
              <h2 className="text-4xl font-bold text-white mb-4">Discover the best food from local restaurants</h2>
              <p className="text-xl text-gray-100 mb-8">Create an account to order your favorite meals and get exclusive deals.</p>
              
              {/* Testimonial */}
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl mt-8 border border-white/20">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-green-200 flex items-center justify-center mr-4">
                    <span className="text-green-700 font-bold">JD</span>
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Jane Doe</h4>
                    <p className="text-gray-200 text-sm">Food Enthusiast</p>
                  </div>
                </div>
                <p className="text-gray-100 italic">
                  "I've been using Uber Eats for over a year now. The variety of restaurants and quick delivery times make it my go-to food delivery app!"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;