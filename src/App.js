import React, { useState, useEffect } from "react";

const PRESET_ARRAY = [{name:"30 Secs",value:30}, {name:"Work 5",value:300}, {name:"Quick 15",value:900}, {name:"30 min",value:1800}, {name:"One hour", value:3600}];
let countdown;
let counter;
let stopped = false;

function App() {
  const [navigationVisible, setNavigationVisible] = useState(false);
  const [timerStopped, setTimerStopped] = useState(true);
  const [insertedSeconds, setInsertedSeconds] = useState(0);
  const [remainSeconds, setRemainSeconds] = useState(0);
  const [controlTitle, setControlTitle] = useState('play');
  const [finishDate, setFinishDate] = useState("");

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

  function navigationContainerClickHandler() {
    setNavigationVisible(!navigationVisible);
  }

  function timerControlsHandler(event) {
    event.preventDefault();
    if (countdown !== undefined){
      clearInterval(countdown);
      countdown = undefined;
      stopped   = true;
      //setControlTitle('Play');
      setTimerStopped(false);
      setFinishDate("");
    }else{
      if (stopped) {
        stopped = false;
        startTimer();
      }else{
        counter = insertedSeconds;
        setRemainSeconds(insertedSeconds);
      }
      //setControlTitle('Stop');
      setTimerStopped(true); 
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
        <PresetNavigation navigationVisible={navigationVisible} insertedSeconds={insertedSeconds} setInsertedSeconds={setInsertedSeconds}/>
        <main>
          <div className="controls-container">
            <div className="clock-face-container-outer">
              <div className="clock-face-container-inner">
                <ClockFaceDisplay remainSeconds={remainSeconds} finishDate={finishDate}/>
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
            <button className="preset-container-button" >{preset.name}</button>
            <button className="preset-container-button-delete">
              <i className="fas fa-trash inactive"></i>
            </button>
          </div>
        );
      })}
      <input
          type="number"
          value={props.insertedSeconds}
          onChange={(e) => props.setInsertedSeconds(parseInt(e.target.value))}
        />
    </nav>
  );
}

function ClockFaceDisplay(props) {
    return (
      <div className="clock-face-container-display" style={{flexDirection:"column"}}>
        {/* <p>
          <span>{(props.hours < 10 ? "0" : "") + props.hours}</span>:
          <span>{(props.minutes < 10 ? "0" : "") + props.minutes}</span>:
          <span>{(props.seconds < 10 ? "0" : "") + props.seconds}</span>
        </p> */}
         <h1 style={{fontSize:"20px"}}>{props.finishDate}</h1>
        <p style={{marginTop:"35px"}}>{props.remainSeconds}</p>
       
      </div>
    );
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
