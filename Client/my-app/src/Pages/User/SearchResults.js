import React, { useEffect, useState, useContext } from "react";

import { useHistory } from "react-router-dom";

import ReservationContext from "../../store/reservation-context";

import { ReservationNav } from "../../Components/User/Flights/ReservationNav";
import { UserFlights } from "../../Components/User/Flights/UserFlights";
import LoadingSpinner from "../../Components/UI/LoadingSpinner";
import { ItemHeader } from "../../Components/User/Flights/ItemHeader";

import { SeatPicker } from "../../Components/User/Flights/SeatPicker";

import useHttp from "../../hooks/use-http";
import { getRoundTrip } from "../../lib/api";

export const SearchResults = () => {
  const [selector, setSelector] = useState(1);

  const history = useHistory();
  const historyState = history.location.state;
  const reservationCtx = useContext(ReservationContext);

  const { sendRequest, status, data } = useHttp(getRoundTrip, true);

  let departureFlights;
  let returnFlights;
  if (data) {
    departureFlights = data.departureFlights;
    returnFlights = data.returnFlights;
    console.log(data);
  }

  useEffect(() => {
    sendRequest(historyState);
  }, [sendRequest, historyState]);

  const departureSeatsHandler = (seats) => {
    console.log("Departure seats = " + seats);
    reservationCtx.setDepartureSeats(seats);
  };

  const returnSeatsHandler = (seats) => {
    console.log("Return seats = " + seats);
    reservationCtx.setReturnSeats(seats);
  };

  const onContinueHandler = () => {
    if (
      selector === 1 &&
      (!reservationCtx.departureFlight || !reservationCtx.returnFlight)
    ) {
      return;
    }

    if (selector < 3) {
      setSelector((state) => state + 1);
    }
  };

  let content;
  if (selector === 1) {
    content = (
      <>
        <div
          style={{ marginBottom: "-2rem", marginTop: "-2rem" }}
          className="centered"
        >
          <ItemHeader from={historyState.fromValue} to={historyState.toValue} />
        </div>
        <div className="centered">
          <UserFlights flights={departureFlights}></UserFlights>
        </div>
        <hr></hr>
        <div style={{ marginBottom: "-2rem" }} className="centered">
          <ItemHeader from={historyState.toValue} to={historyState.fromValue} />
        </div>
        <div className="centered">
          <UserFlights flights={returnFlights}></UserFlights>
        </div>
      </>
    );
  }

  if (selector === 2) {
    const seatsNumber =
      parseInt(historyState.adultsNum) + parseInt(historyState.childrenNum);
    content = (
      <div className="centered">
        <div className="centered-half">
          <h3>Choose your {seatsNumber} seat(s) in the departure flight:</h3>
          <SeatPicker
            trip={historyState}
            flight={reservationCtx.departureFlight}
            max={seatsNumber}
            onSeatsChange={departureSeatsHandler}
          />
        </div>
        <div className="centered-half">
          <h3>Choose your {seatsNumber} seat(s) in the return flight:</h3>
          <SeatPicker
            trip={historyState}
            flight={reservationCtx.departureFlight}
            max={seatsNumber}
            onSeatsChange={returnSeatsHandler}
          />
        </div>
      </div>
    );
  }

  if (status === "pending") {
    return (
      <div className="centered">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <div className="centered">
        <ReservationNav
          onContinueClicked={onContinueHandler}
          selector={selector}
        ></ReservationNav>
      </div>
      {content}
    </>
  );
};