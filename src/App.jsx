import React, { useEffect } from "react";
import styled from "styled-components";
import { PlayIcon, PauseIcon } from "@heroicons/react/20/solid";
import { motion } from "framer-motion";
import { useRecoilState } from "recoil";
import { timerState, isRunningState, roundState, goalState } from "./atom";

const Container = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f4511e;
  color: white;
  font-family: Arial, sans-serif;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 2rem;
`;

const TimerContainer = styled.div`
  display: flex;
  align-items: center;
  font-size: 6rem;
  margin-bottom: 2rem;
`;

const TimeBox = styled(motion.div)`
  background-color: rgba(255, 255, 255, 0.1);
  padding: 1rem 2rem;
  border-radius: 10px;
  margin: 0 0.5rem;
`;

const Separator = styled.span`
  font-size: 6rem;
`;

const Button = styled(motion.button)`
  font-size: 1.5rem;
  padding: 1rem 2rem;
  background-color: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
`;

const Stats = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
  max-width: 300px;
  margin-top: 2rem;
`;

const containerVariants = {
  start: { opacity: 0 },
  end: {
    opacity: 1,
    transition: { duration: 1 },
  },
};

const timeBoxVariants = {
  start: { scale: 1 },
  end: { scale: [1, 1.1, 1], transition: { duration: 0.3 } },
};

const buttonVariants = {
  hover: { scale: 1.1 },
  tap: { scale: 0.9 },
};

export default function App() {
  const [timer, setTimer] = useRecoilState(timerState);
  const [isRunning, setIsRunning] = useRecoilState(isRunningState);
  const [round, setRound] = useRecoilState(roundState);
  const [goal, setGoal] = useRecoilState(goalState);

  const resetTimer = () => {
    setTimer({ minutes: 30, seconds: 0 }); // 테스트를 위해 2초로 설정
  };

  useEffect(() => {
    let interval;
    if (isRunning && (timer.minutes > 0 || timer.seconds > 0)) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer.seconds > 0) {
            return { ...prevTimer, seconds: prevTimer.seconds - 1 };
          } else if (prevTimer.minutes > 0) {
            return {
              ...prevTimer,
              minutes: prevTimer.minutes - 1,
              seconds: 59,
            };
          } else {
            setIsRunning(false);
            return { minutes: 0, seconds: 0 };
          }
        });
      }, 1000);
    } else if (timer.minutes === 0 && timer.seconds === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, timer, round, setGoal]);

  useEffect(() => {
    if (timer.minutes === 0 && timer.seconds === 0 && !isRunning) {
      setRound((prevRound) => {
        const newRound = prevRound.current + 1;
        if (newRound >= 4) {
          return { ...prevRound, current: 0, shouldIncrementGoal: true };
        }
        return { ...prevRound, current: newRound };
      });
      resetTimer();
    }
  }, [timer, isRunning, setRound]);

  useEffect(() => {
    if (round.shouldIncrementGoal) {
      setGoal((prevGoal) => ({
        ...prevGoal,
        current: Math.min(prevGoal.current + 1, prevGoal.total),
      }));
      setRound((prevRound) => ({ ...prevRound, shouldIncrementGoal: false }));
    }
  }, [round, setGoal, setRound]);

  const toggleTimer = () => {
    if (timer.minutes === 0 && timer.seconds === 0) {
      resetTimer();
    }
    setIsRunning((prev) => !prev);
  };

  useEffect(() => {
    console.log("Timer:", timer);
    console.log("Round:", round);
    console.log("Is Running:", isRunning);
  }, [timer, round, isRunning]);

  return (
    <Container variants={containerVariants} initial="start" animate="end">
      <Title>Pomodoro</Title>
      <TimerContainer>
        <TimeBox variants={timeBoxVariants} initial="start" animate="end">
          {String(timer.minutes).padStart(2, "0")}
        </TimeBox>
        <Separator>:</Separator>
        <TimeBox
          variants={timeBoxVariants}
          initial="start"
          animate="end"
          key={timer.seconds}
        >
          {String(timer.seconds).padStart(2, "0")}
        </TimeBox>
      </TimerContainer>
      <Button
        onClick={toggleTimer}
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
      >
        {isRunning ? (
          <PauseIcon width={24} height={24} />
        ) : (
          <PlayIcon width={24} height={24} />
        )}
      </Button>
      <Stats>
        <div>
          <p>
            {round.current}/{round.total}
          </p>
          <p>ROUND</p>
        </div>
        <div>
          <p>
            {goal.current}/{goal.total}
          </p>
          <p>GOAL</p>
        </div>
      </Stats>
    </Container>
  );
}
