import React, { useState, useEffect, useRef } from "react";
import { getI18N } from "../i18n/index.ts";

const Weathere = ({ currentLocale }) => {
  const [cityName, setCityName] = useState("");
  const [datos, setDatos] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [fallo, setFallo] = useState(false);
  const [rainChance, setRainChance] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const i18n = getI18N({ currentLocale });

  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;

    if (!scrollContainer) return;

    const handleWheel = (evt) => {
      evt.preventDefault();

      if (evt.deltaY >= -15 && evt.deltaY <= 15) {
        scrollContainer.scrollLeft += evt.deltaY * 1;
      } else {
        scrollContainer.scrollLeft += evt.deltaY * 1;
      }
    };

    scrollContainer.addEventListener("wheel", handleWheel);

    return () => {
      scrollContainer.removeEventListener("wheel", handleWheel);
    };
  }, []);

  const handleChange = async (event) => {
    const input = event.target.value;
    setCityName(input);
    setDatos(null);
    setForecast(null);
    try {
      const response = await fetch(`/api/weather/search/${input}`);
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error("Error al obtener sugerencias de ciudades:", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const responseCurrent = await fetch(
        `/api/weather/${cityName}?locale=${currentLocale}`,
      );
      if (!responseCurrent.ok) {
        throw new Error("No se pudo obtener la respuesta de la API actual");
      }
      const dataCurrent = await responseCurrent.json();

      const responseForecast = await fetch(
        `/api/weather/forecast/${cityName}?locale=${currentLocale}`,
      );
      if (!responseForecast.ok) {
        throw new Error(
          "No se pudo obtener la respuesta de la API de pronóstico",
        );
      }
      const dataForecast = await responseForecast.json();

      const currentTimeEpoch = dataCurrent.location.localtime_epoch;
      const forecastData = dataForecast.forecast;
      const rainChance = forecastData.forecastday[0].day.daily_chance_of_rain;
      setRainChance(rainChance);
      if (
        forecastData &&
        forecastData.forecastday &&
        forecastData.forecastday.length > 0
      ) {
        const filteredForecast = forecastData.forecastday[0].hour.filter(
          (hourData) => hourData.time_epoch > currentTimeEpoch,
        );

        if (filteredForecast.length > 5) {
          filteredForecast.splice(5);
        }

        setForecast({ forecastday: [{ hour: filteredForecast }] });
      } else {
        setForecast(null);
      }

      setDatos(dataCurrent);
      setFallo(false);
    } catch (error) {
      console.error("Error al obtener datos:", error);
      setDatos(null);
      setForecast(null);
      setFallo(true);
    }
  };

  const handleSuggestionClick = async (suggestion) => {
    setCityName(suggestion.name);
    setSuggestions([]);
    try {
      const responseCurrent = await fetch(
        `/api/weather/${suggestion.id}?locale=${currentLocale}&sugested=true`,
      );
      if (!responseCurrent.ok) {
        throw new Error("No se pudo obtener la respuesta de la API actual");
      }
      const dataCurrent = await responseCurrent.json();

      const responseForecast = await fetch(
        `/api/weather/forecast/${suggestion.id}?locale=${currentLocale}&sugested=true`,
      );
      if (!responseForecast.ok) {
        throw new Error(
          "No se pudo obtener la respuesta de la API de pronóstico",
        );
      }
      const dataForecast = await responseForecast.json();

      const currentTimeEpoch = dataCurrent.location.localtime_epoch;
      const forecastData = dataForecast.forecast;
      const rainChance = forecastData.forecastday[0].day.daily_chance_of_rain;
      setRainChance(rainChance);
      if (
        forecastData &&
        forecastData.forecastday &&
        forecastData.forecastday.length > 0
      ) {
        const filteredForecast = forecastData.forecastday[0].hour.filter(
          (hourData) => hourData.time_epoch > currentTimeEpoch,
        );

        if (filteredForecast.length > 5) {
          filteredForecast.splice(5);
        }

        setForecast({ forecastday: [{ hour: filteredForecast }] });
      } else {
        setForecast(null);
      }

      setDatos(dataCurrent);
      setFallo(false);
    } catch (error) {
      console.error("Error al obtener datos:", error);
      setDatos(null);
      setForecast(null);
      setFallo(true);
    }
  };

  return (
    <div>
      <div className="md:scale-105 md:mt-4 lg:scale-125 lg:mt-8 2xl:scale-150 2xl:mt-16">
        <form onSubmit={handleSubmit} className="flex gap-x-8 justify-center">
          <div className="items-center">
            <label htmlFor="city" className="label">
              {i18n.NAME_CITY}
            </label>
            <input
              className={`input input-bordered input-${fallo ? "error" : "accent"} w-full max-w-xs`}
              type="text"
              name="city"
              autoComplete="off"
              value={cityName}
              onChange={handleChange}
              placeholder={i18n.INPUT_PLACEHOLDER}
            />
            {fallo ? (
              <div className="label absolute items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current shrink-0 text-red-400 mr-2 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="label-text-alt text-[10px] text-red-400">
                  {i18n.ERROR_MESSAGE}
                </span>
              </div>
            ) : null}
          </div>
          <div className="flex items-end">
            <button className="btn btn-accent btn-outline" type="submit">
              {i18n.SEARCH_BUTTON}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="w-4 h-4 opacity-70"
              >
                <path
                  fillRule="evenodd"
                  d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </form>
        {!datos && suggestions.length > 0 ? (
          <div className="grid grid-flow-col grid-rows-3 lg:grid-rows-1 lg:grid-cols-1 gap-4 mt-4 text-[10px]">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                className="btn btn-secondary btn-sm btn-outline"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion.name}
              </button>
            ))}
          </div>
        ) : null}
      </div>
      <div className="md:scale-105 md:mt-12 lg:scale-125 lg:mt-24 2xl:scale-150 2xl:mt-32">
        {datos ? (
          <div className="mt-12 text-center text-xl p-4 rounded-lg max-w-xs mx-auto">
            <h1 className="font-bold text-[20px]">
              {datos.location.name},{" "}
              {currentLocale === "en"
                ? datos.location.country
                : datos.location.country !== "Spain"
                  ? datos.location.country
                  : "España"}{" "}
              - {datos.location.localtime.split(" ")[1]}
            </h1>
            <div className="flex items-center justify-center ">
              <img
                src={datos.current.condition.icon}
                alt={datos.current.condition.text}
                className="h-16 w-16 -ml-12"
              />
              <p>{datos.current.temp_c}°C</p>
            </div>
            <div className="grid place-content-center text-center gap-4">
              <p>
                {i18n.FEELS_LIKE} {datos.current.feelslike_c}°C
              </p>
              <div
                className="mx-auto text-[18px] radial-progress text-blue-400 flex items-center "
                style={{ "--value": rainChance, "--thickness": "6px" }}
                role="progressbar"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="#08c"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M7.502 19.423c2.602 2.105 6.395 2.105 8.996 0c2.602 -2.105 3.262 -5.708 1.566 -8.546l-4.89 -7.26c-.42 -.625 -1.287 -.803 -1.936 -.397a1.376 1.376 0 0 0 -.41 .397l-4.893 7.26c-1.695 2.838 -1.035 6.441 1.567 8.546z" />
                </svg>
                <span className="text-black">{rainChance}%</span>
              </div>
            </div>
          </div>
        ) : null}
      </div>
      {forecast ? (
        <div className="md:scale-105 md:mt-12 lg:scale-125 lg:mt-24 2xl:scale-150 2xl:mt-32">
          <h2 className="font-bold my-8">{i18n.FORECAST_TITLE}</h2>
          <div
            ref={scrollContainerRef}
            className="bg-blue-300 scroll-container overflow-x-auto no-scrollbar overflow-y-hidden max-w-sm rounded-lg p-4 grid grid-rows-1 text-center gap-4 grid-flow-col"
          >
            {forecast.forecastday[0].hour.map((hourData, index) => (
              <div
                className="bg-blue-200 px-6 rounded-lg hover:scale-105 py-2 glass-effect"
                key={index}
              >
                <p>{hourData.time.split(" ")[1]}</p>
                <img
                  src={hourData.condition.icon}
                  alt={hourData.condition.text}
                  className="h-12 w-12"
                />
                <p>{hourData.temp_c}°C</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Weathere;
