import { useEffect, useState } from "react";
import { debounce } from "./utils";

interface SearchResultInterface {
  url: string,
  title: string,

}
const VoiceIcon = () => {
  return (
    <svg
      focusable="false"
      viewBox="0 0 24 24"
      width={40}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="#4285f4"
        d="m12 15c1.66 0 3-1.31 3-2.97v-7.02c0-1.66-1.34-3.01-3-3.01s-3 1.34-3 3.01v7.02c0 1.66 1.34 2.97 3 2.97z"
      ></path>
      <path fill="#34a853" d="m11 18.08h2v3.92h-2z"></path>
      <path
        fill="#fbbc04"
        d="m7.05 16.87c-1.27-1.33-2.05-2.83-2.05-4.87h2c0 1.45 0.56 2.42 1.47 3.38v0.32l-1.15 1.18z"
      ></path>
      <path
        fill="#ea4335"
        d="m12 16.93a4.97 5.25 0 0 1 -3.54 -1.55l-1.41 1.49c1.26 1.34 3.02 2.13 4.95 2.13 3.87 0 6.99-2.92 6.99-7h-1.99c0 2.92-2.24 4.93-5 4.93z"
      ></path>
    </svg>
  );
};
function App() {
  const [searchResult, setSearchResult] = useState([]);
  const [searchItem, setSearchItem] = useState("");
  const [isInFocus,setIsInFocus] = useState(false); 
  useEffect(() => {
    if(searchItem === ''){
         setSearchResult([]);
         return;
    }
    debounce(() => {
      fetch(`http://localhost:8088/query`, {
        method: "POST",
        body: JSON.stringify({ query: searchItem }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);

          setSearchResult(data);
          console.log(searchResult);
        });
    }, 1000)();
  }, [searchItem,searchResult]);
  return (
    <div className="w-full h-screen flex justify-center items-center flex-col">
      <img width={500} src="./img-transformed.png" alt="google logo" />
      <div className="shadow-lg rounded-md">
        <div className="rounded-full shadow-lg p-2 flex mt-6 items-centre gap-3 border-2 border-gray-300 w-[600px]">
          <img src="./magnifying-glass.png" alt="search icon" width={30} />
          <input
            onFocus={() => setIsInFocus(true)}
            onBlur={() => setIsInFocus(false)}
            onChange={(e) => setSearchItem(e.target.value)}
            value={searchItem}
            type="text"
            className=" text-xl px-2 flex-grow outline-none"
          />
          <VoiceIcon />
        </div>
        <div className="space-y-3">
          {searchResult.map((r: SearchResultInterface) => (
            <div className="w-[600px] text-xl flex item-center">
              <img
                width={40}
                height={40}
                src="./magnifying-glass.png"
                alt="lens "
              />
              <a href={r.url}>{r.title}</a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
