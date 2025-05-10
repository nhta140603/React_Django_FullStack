import React, { useState } from "react";
import DestinationCard from "./DestinationCard";
import { use } from "react";
import {getList} from "../api/user_api"

export default function DestinationList() {
  const [destination, setDestination] = useState([]);
  const [error, setError] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchDestination() {
      try{
        setLoading(true);
        setError(null);
        const data = await getList('destinations');
        setDestination(data);
      }catch(err){
        setError(err.message || `Có lỗi xảy ra`);
      }finally{
        setLoading(false);
      }
  }
  useEffect(() => {
    fetchDestination()
  }, [])
  return (
    <div className="py-10 px-4 max-w-6xl mx-auto ">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {destinations1.map((d) => (
          <DestinationCard key={d.id} destination={d} />
        ))}
      </div>
    </div>
  );
}