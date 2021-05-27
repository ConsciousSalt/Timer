import React, { useState, useEffect } from "react";

const PRESET_ARRAY = [
  { name: "30 Secs", value: 30 },
  { name: "Work 5", value: 300 },
  { name: "Quick 15", value: 900 },
  { name: "30 min", value: 1800 },
  { name: "One hour", value: 3600 },
];
let countdown;
let counter;
let stopped = false;

function App() {
  const [navigationVisible, setNavigationVisible] = useState(false);
  const [timerStopped, setTimerStopped] = useState(true);
  const [insertedSeconds, setInsertedSeconds] = useState(0);
  const [remainSeconds, setRemainSeconds] = useState(0);
  const [finishDate, setFinishDate] = useState("");

  function updateTimer() {
    setRemainSeconds(--counter);
    setFinishDate(new Date(Date.now() + counter * 1000).toLocaleString());
    if (counter <= 0) {
      setTimerStopped(true);
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

  function navigationContainerClickHandler() {
    setNavigationVisible(!navigationVisible);
  }

  function timerControlsHandler(event) {
    event.preventDefault();
    if (countdown !== undefined) {
      clearInterval(countdown);
      countdown = undefined;
      stopped = true;
      setTimerStopped(true);
      setFinishDate("");
    } else {
      if (stopped) {
        stopped = false;
        startTimer();
      } else {
        counter = insertedSeconds;
        setRemainSeconds(insertedSeconds);
      }
      setTimerStopped(false);
    }
    if (insertedSeconds !== 0) {
      setInsertedSeconds(0);
    }
  }

  return (
    <div className="App">
      <header>
        <NavigationHeaderContainer
          buttonHandler={navigationContainerClickHandler}
        />
        <NameContainer />
        <SettingsIconContainer />
      </header>
      <div className="content">
        <PresetNavigation
          navigationVisible={navigationVisible}
          insertedSeconds={insertedSeconds}
          setInsertedSeconds={setInsertedSeconds}
          timerControlsHandler={timerControlsHandler}
        />
        <main>
          <div className="controls-container">
            <div className="clock-face-container-outer">
              <div className="clock-face-container-inner">
                <ClockFaceDisplay
                  remainSeconds={remainSeconds}
                  finishDate={finishDate}
                />
                <ClockFaceControls
                  timerControlsHandler={timerControlsHandler}
                  timerStopped={timerStopped}
                />
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
      <input
        type="number"
        value={props.insertedSeconds}
        onChange={(e) => props.setInsertedSeconds(parseInt(e.target.value))}
        onKeyDown={(e) => {
          console.log('onKeyDown', e.code);
          if (e.target.value > 0 && e.code === 'Enter' || e.code === 'NumpadEnter') {
            console.log('onKeyDown:value', e.target.value);
            props.timerControlsHandler(e);
          }
        }}
      />
      <br />
      {PRESET_ARRAY.map((preset, index) => {
        return (
          <div key={index} className="preset-container">
            <button className="preset-container-button">{preset.name}</button>
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
  let hours = Math.floor(props.remainSeconds / 3600);
  let hoursReminder = props.remainSeconds % 3600;
  let minutes = Math.floor(hoursReminder / 60);
  let seconds = hoursReminder % 60;

  return (
    <div
      className="clock-face-container-display"
      style={{ flexDirection: "column" }}
    >
      <h1
        style={{
          fontSize: "20px",
          width: "170px",
          height: "25px",
          marginTop: "25px",
        }}
      >
        {props.finishDate}
      </h1>
      <p style={{ marginTop: "35px" }}>
        <span
          style={{ maxWidth: "130px", width: "130px", display: "inline-block" }}
        >
          {(hours < 10 ? "0" : "") + hours}
        </span>
        :
        <span
          style={{ maxWidth: "130px", width: "130px", display: "inline-block" }}
        >
          {(minutes < 10 ? "0" : "") + minutes}
        </span>
        :
        <span
          style={{ maxWidth: "92px", width: "92px", display: "inline-block" }}
        >
          {(seconds < 10 ? "0" : "") + seconds}
        </span>
      </p>
    </div>
  );
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
        <i class="fas fa-pause"></i>
      )}
    </div>
  );
}

export default App;
