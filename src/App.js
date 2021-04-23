import React, { useState, useEffect } from "react";

const PRESET_ARRAY = [{name:"30 Secs",value:30}, {name:"Work 5",value:300}, {name:"Quick 15",value:900}, {name:"30 min",value:1800}, {name:"One hour", value:3600}];
let countdown;

function App() {
  const [navigationVisible, setNavigationVisible] = useState(false);
  const [timerStopped, setTimerStopped] = useState(true);

  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const [endTime, setEndTime] = useState(0);

  useEffect(() => {
    console.log(endTime);
  }, [endTime]);

  function navigationContainerClickHandler() {
    setNavigationVisible(!navigationVisible);
  }

  function timerControlsHandler() {
    if (!timerStopped) {
      clearInterval(countdown);
    } else {
      countdown = setInterval(() => {
        // const now = new Date(Date.now());
        // setSeconds(now.getSeconds());
        // setMinutes(now.getMinutes());
        // setHours(now.getHours());
        updateTimer();
      }, 1000);
    };

    setTimerStopped(!timerStopped);
  }

  function updateTimer() {
    let secondsLeft = Math.round((endTime - Date.now()) / 1000);
    if(secondsLeft < 0){ 
        // if (allowSound){
        //     snd.play();
        // }   
        setTimerStopped(true);
        return;
    }
    updateTimeLeft(secondsLeft);  
  }

  function updateTimeLeft(seconds) {
    let hours = (seconds / 360 < 1 ? Math.floor(seconds / 360): null) ;
    let reminderMinutes = hours % 360;
    let minutes = Math.floor(reminderMinutes / 60);
    let remindSeconds = reminderMinutes % 60;
    setHours(hours);
    setMinutes(minutes);
    setSeconds(remindSeconds);
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
        <PresetNavigation navigationVisible={navigationVisible} setEndTime={setEndTime}/>
        <main>
          <div className="controls-container">
            <div className="clock-face-container-outer">
              <div className="clock-face-container-inner">
                <ClockFaceDisplay
                  hours={hours}
                  minutes={minutes}
                  seconds={seconds}
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
      {PRESET_ARRAY.map((preset, index) => {
        return (
          <div key={index} className="preset-container">
            <button className="preset-container-button" onClick={()=>{props.setEndTime(preset.value) }}>{preset.name}</button>
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
  if (props.minutes) {
    return (
      <div className="clock-face-container-display">
        <p>
          <span>{(props.hours < 10 ? "0" : "") + props.hours}</span>:
          <span>{(props.minutes < 10 ? "0" : "") + props.minutes}</span>:
          <span>{(props.seconds < 10 ? "0" : "") + props.seconds}</span>
        </p>
      </div>
    );
  } else {
    return null;
  }
}

function ClockFaceControls(props) {
  let classes=['clock-face-container-controls-container'];
  if (!props.timerStopped){
    classes.push('stopped');
  }

  return (
    <div className={classes.join(' ')} onClick={props.timerControlsHandler}>
      {props.timerStopped?<i className="fas fa-play"></i>:<i class="fas fa-pause"></i>}
    </div>
  );
}

export default App;
