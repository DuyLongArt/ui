const ForbiddenPage = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl font-bold mb-4">You are not allowed to access this page</h1>
            <p className="text-lg mb-4">Please contact your administrator for assistance.</p>
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded" onClick={() => window.location.href = "/"}>
                Back to Home
            </button>
        </div>
    );
};

export default ForbiddenPage;
