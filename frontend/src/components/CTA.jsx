import React from "react";

const CTA = () => {
  return (
    <div className="flex flex-col items-center my-24 md:my-32">
      <div className="flex flex-col items-center justify-around max-sm:text-sm border border-gray-200 rounded-2xl m-2 py-20 max-w-5xl w-full bg-white">
        <h2 className="text-2xl md:text-4xl font-bold text-gray-800">
          Boost your productivity today
        </h2>
        <p className="mt-4 text-slate-500 max-w-xl text-center">
          Incididunt sint fugiat pariatur cupidatat consectetur sit cillum anim
          id veniam aliqua proident excepteur commodo do ea.
        </p>
        <div className="flex items-center gap-4 mt-6">
          <button className="bg-indigo-500 hover:bg-indigo-600 px-8 py-3 text-white font-medium rounded-lg shadow-md active:scale-95 transition-all">
            Get Started
          </button>
          <button className="group flex items-center gap-2 px-8 py-3 font-medium border border-gray-400 rounded-lg hover:bg-gray-100 transition active:scale-95">
            Learn More
            <svg className="mt-1 group-hover:translate-x-1 transition-transform" width="15" height="11" viewBox="0 0 15 11" fill="none">
              <path d="M1 5.5h13.092M8.949 1l5.143 4.5L8.949 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CTA;