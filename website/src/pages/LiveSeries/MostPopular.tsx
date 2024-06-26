import React, { useContext, useEffect, useState } from "react";
import { useOutletContext, useSearchParams } from "react-router-dom";
import TvShowPreviewList from "../../components/LiveSeries/TvShowPreviewList";
import { TvShowList } from "../../misc/models";
import { TranslationContext } from "../../misc/context";
import { setTitle } from "../../misc/util";
import { getLiveSeriesTitle, LiveSeriesOutletContext } from "./Base";

export default function MostPopular() {
  const [results, setResults] = useState<TvShowList | null>(null);
  const data = useContext(TranslationContext);
  const { fetchResource } = useOutletContext<LiveSeriesOutletContext>();
  const [searchParams] = useSearchParams();

  const title = getLiveSeriesTitle("mostPopular");

  useEffect(() => {
    setTitle(title);
  }, [data]);

  useEffect(() => {
    const searchedPage = +(searchParams.get("page") ?? "");
    if (searchedPage === results?.page) return;

    // Predictively update the page number in the old data
    setResults((old) => old && { ...old, page: searchedPage });
    fetchResource("most-popular", { onSuccess: setResults });
  }, [searchParams]);

  return (
    <>
      <h2>{title}</h2>
      <TvShowPreviewList tvShows={results ?? undefined} />
    </>
  );
}

