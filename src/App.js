import React, { useState, useEffect } from "react";

const PRESET_ARRAY = [
  { name: "30 Secs", value: 30 },
  { name: "Work 5", value: 300 },
  { name: "Quick 15", value: 900 },
  { name: "30 min", value: 1800 },
  { name: "One hour", value: 3600 },
  { name: "Two hours", value: 7200 },
];
let countdown;
let counter;
let stopped = false;

function App() {
  const [insertedSeconds, setInsertedSeconds] = useState(0);
  const [remainSeconds, setRemainSeconds] = useState(0);
  const [controlTitle, setControlTitle] = useState('play');
  const[finishDate, setFinishDate] = useState("");

  function updateTimer() {
    setRemainSeconds(--counter);
    setFinishDate(new Date(Date.now()+counter*1000).toLocaleString());
    if (counter<=0){
      setControlTitle('Play');
    }
  }

  function stopTimer() {
    clearInterval(countdown);
    countdown = undefined;
  }

  function startTimer() {
    countdown = setInterval(updateTimer, 1000);
  }

  useEffect(() => {
    if (countdown !== undefined && counter <= 0) {
      stopTimer();
    }

    if (countdown === undefined && counter > 0) {
      startTimer();
    }

    return () => {
      clearInterval(countdown);
      countdown = undefined;
    };
  }, [remainSeconds]);

  return (
    <div className="App">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (countdown !== undefined){
            clearInterval(countdown);
            countdown = undefined;
            stopped   = true;
            setControlTitle('Play');
            setFinishDate("");
          }else{
            if (stopped) {
              stopped = false;
              startTimer();
            }else{
              counter = insertedSeconds;
              setRemainSeconds(insertedSeconds);
            }
            setControlTitle('Stop'); 
          }
        }}
      >
        <input
          type="number"
          value={insertedSeconds}
          onChange={(e) => setInsertedSeconds(parseInt(e.target.value))}
        />
        <input type="submit" value={controlTitle}/>
      </form>
      <div className="content">
        <main>
          <div className="controls-container">
            <div className="clock-face-container-outer">
              <div className="clock-face-container-inner">
                <p className={controlTitle==="Stop"?"":"blink"}>{remainSeconds}</p>
                <p>{finishDate}</p>
                {/* <ClockFaceDisplay
                  hours={hours}
                  minutes={minutes}
                  seconds={seconds}
                />
                <ClockFaceControls
                  timerControlsHandler={timerControlsHandler}
                  timerStopped={timerStopped}
                /> */}
              </div>
            </div>
            <div className="counter-container"></div>
          </div>
        </main>
      </div>
    </div>
  );
}

function NavigationHeaderContainer(props) {
  return (
    <div className="navigation-header-container" onClick={props.buttonHandler}>
      <i className="fas fa-bars"></i>
    </div>
  );
}

function NameContainer(props) {
  return (
    <div className="name-container">
      <p>NAME</p>
    </div>
  );
}

function SettingsIconContainer() {
  return <div className="settings-icon-container"></div>;
}

function PresetNavigation(props) {
  if (!props.navigationVisible) {
    return null;
  }

  return (
    <nav>
      {PRESET_ARRAY.map((preset, index) => {
        return (
          <div key={index} className="preset-container">
            <button
              className="preset-container-button"
              onClick={() => {
                props.setEndTime(preset.value);
              }}
            >
              {preset.name}
            </button>
            <button className="preset-container-button-delete">
              <i className="fas fa-trash inactive"></i>
            </button>
          </div>
        );
      })}
    </nav>
  );
}

function ClockFaceDisplay(props) {
  //if (props.minutes || props.seconds) {
  return (
    <div className="clock-face-container-display">
      <p>
        <span>{(props.hours < 10 ? "0" : "") + props.hours}</span>:
        <span>{(props.minutes < 10 ? "0" : "") + props.minutes}</span>:
        <span>{(props.seconds < 10 ? "0" : "") + props.seconds}</span>
      </p>
    </div>
  );
  // } else {
  //   return null;
  // }
}

function ClockFaceControls(props) {
  let classes = ["clock-face-container-controls-container"];
  if (!props.timerStopped) {
    classes.push("stopped");
  }

  return (
    <div className={classes.join(" ")} onClick={props.timerControlsHandler}>
      {props.timerStopped ? (
        <i className="fas fa-play"></i>
      ) : (
        <i className="fas fa-pause"></i>
      )}
    </div>
  );
}

export default App;
