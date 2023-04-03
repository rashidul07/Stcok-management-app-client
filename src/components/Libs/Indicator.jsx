import UseContext from "../contexts/UseContext";

export const Indicator = ({ item }) => {
    const { isLoading } = UseContext()

    return (
        <div className="indicator">
            <button className={`btn bg-black text-white min-h-6 h-6 text-base ${isLoading ? 'loading' : 'pb-6'} `}>{!isLoading && item}</button>
        </div>
    );
}