function LoadingSpinner({ message = "Loading..." }) {
    return (
        <div
            className="
                flex
                justify-center
                items-center
                p-8
            "
        >
            <div
                className="
                    text-blue-600
                    font-semibold
                    text-lg
                "
            >
                {message}
            </div>
        </div>
    );
}

export default LoadingSpinner;