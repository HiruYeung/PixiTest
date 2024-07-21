"use client";

import { useTick, Stage, Container, Sprite, Text } from "@pixi/react";
import "@pixi/events";
import { useState, useEffect } from "react";

function Bold({ x, image, visible }) {
  return (
    <Sprite
      image={image || "https://i.imgur.com/LQCGErC.png"}
      x={x}
      width={150}
      height={150}
      visible={visible}
    />
  );
}

function Bunny({ yPos }) {
  return (
    <Sprite
      image={"https://s3-us-west-2.amazonaws.com/s.cdpn.io/693612/IaUrttj.png"}
      x={100}
      width={80}
      height={100}
      y={yPos + 80}
      anchor={0.5}
    />
  );
}

function BunnyMove({ xPos, yPos, visible }) {
  return (
    <Sprite
      image={"https://s3-us-west-2.amazonaws.com/s.cdpn.io/693612/IaUrttj.png"}
      width={50}
      height={50}
      x={xPos}
      y={yPos + 80}
      anchor={0.5}
      visible={visible}
    />
  );
}

function ArrowUp({ onClick }) {
  return (
    <Sprite
      interactive
      pointerup={onClick}
      anchor={0.5}
      x={499}
      y={470}
      width={50}
      height={50}
      image={"https://i.imgur.com/ubTEwZ5.png"}
    />
  );
}

function ArrowDown({ onClick }) {
  return (
    <Sprite
      interactive
      pointerup={onClick}
      anchor={0.5}
      x={500}
      y={530}
      width={50}
      height={50}
      image={"https://i.imgur.com/A0nFtug.png"}
    />
  );
}

function PlaygroundContainer() {
  const [bunnyY, setBunnyY] = useState(200);
  const [bunnies, setBunnies] = useState([]);
  const [boldStates, setBoldStates] = useState([true, true, true, true, true]);
  const [score, setScore] = useState(100);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setBunnies((prevBunnies) => [
        ...prevBunnies,
        { x: 1000, y: Math.random() * 400, visible: true },
      ]);
    }, 2000);
    return () => clearInterval(interval);
  }, [gameOver]);

  const moveBunnyUp = () => {
    setBunnyY((prevY) => prevY - 40);
  };

  const moveBunnyDown = () => {
    setBunnyY((prevY) => prevY + 40);
  };

  useTick((delta) => {
    if (gameOver) return;

    setBunnies((prevBunnies) =>
      prevBunnies.map((bunny) => {
        const nextX = bunny.x - 5 * delta;
        return nextX < -50
          ? { ...bunny, x: 1000, y: Math.random() * 400 }
          : { ...bunny, x: nextX };
      })
    );

    setBunnies((prevBunnies) =>
      prevBunnies.map((bunny) => {
        if (bunny.x < 180 && bunny.x > 100 && bunny.visible) {
          if (bunnyY + 50 > bunny.y && bunnyY - 50 < bunny.y) {
            setScore((prevScore) => prevScore - 20);
            bunny.visible = false;
            for (let i = boldStates.length - 1; i >= 0; i--) {
              if (boldStates[i]) {
                setBoldStates((prev) =>
                  prev.map((state, index) => (index === i ? false : state))
                );
                break;
              }
            }
          }
        }
        return bunny;
      })
    );

    if (boldStates.every((state) => !state)) {
      setGameOver(true);
    }
  });

  return (
    <Container>
      {boldStates.map((visible, index) => (
        <Bold
          key={index}
          x={index * 80}
          visible={visible}
          image={
            !visible
              ? "https://i.imgur.com/dXLz0dH.png"
              : "https://i.imgur.com/LQCGErC.png"
          }
        />
      ))}
      {gameOver ? (
        <Text
          text="End"
          x={500}
          y={300}
          anchor={0.5}
          style={{ fill: "red", fontSize: 60 }}
        />
      ) : (
        <>
          <Bunny yPos={bunnyY} />
          <ArrowUp onClick={moveBunnyUp} />
          <ArrowDown onClick={moveBunnyDown} />
          {bunnies.map((bunny, index) => (
            <BunnyMove
              key={index}
              xPos={bunny.x}
              yPos={bunny.y}
              visible={bunny.visible}
            />
          ))}
        </>
      )}
      <Text
        text={`Score: ${score}`}
        x={750}
        y={50}
        style={{ fill: "Black", fontSize: 36 }}
      />
    </Container>
  );
}

export default function PixiPlayground() {
  return (
    <Stage width={1000} height={600} options={{ backgroundColor: 0xeef1f5 }}>
      <PlaygroundContainer />
    </Stage>
  );
}