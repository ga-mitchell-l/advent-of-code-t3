import { api } from "~/utils/api";
import { useState } from "react";
import Puzzle from "~/components/Puzzle";
import type { PartResults } from "~/classes/PuzzleResults";

export default function Day07() {
  const [parts, setParts] = useState<PartResults>({
    part1: 0,
    part2: 0,
  });

  const day = 7;
  const year = 2023;
  const data: string[] = api.file.getInputFile.useQuery({
    year: year,
    day: day,
  }).data;
  const exampleData: string[] = [
    "32T3K 765",
    "T55J5 684",
    "KK677 28",
    "KTJJT 220",
    "QQQJA 483",
  ];
  const cardRank = "23456789TJQKA".split("");
  const jokerCardRank = "J23456789TQKA".split("");
  type Hand = {
    hand: string;
    type: number;
    rank: number[];
    jokerRank: number[];
    bid: number;
    jokerType: number;
  };

  const handTypes = [0, 1, 2, 3, 4, 5, 6];

  const processData = (data: string[] | undefined) => {
    if (data) {
      const hands: Hand[] = getHands(data);
      const orderedHands: Hand[] = orderHands(
        JSON.parse(JSON.stringify(hands)),
        false,
      );
      const jokerOrderedHands: Hand[] = orderHands(
        JSON.parse(JSON.stringify(hands)),
        true,
      );

      const totalWinnings = orderedHands.reduce(
        (accumulator, currentValue, index) => {
          return accumulator + (index + 1) * currentValue.bid;
        },
        0,
      );

      const jokerTotalWinnings = jokerOrderedHands.reduce(
        (accumulator, currentValue, index) => {
          return accumulator + (index + 1) * currentValue.bid;
        },
        0,
      );

      setParts({
        part1: totalWinnings,
        part2: jokerTotalWinnings,
      });
    }
  };

  const GetHandType = (handArray: string[], joker: boolean): number => {
    // 6 - Five of a kind
    // 5 - Four of a kind
    // 4 - Full house
    // 3 - Three of a kind
    // 2 - Two pair
    // 1 - One pair
    // 0 - High card

    const letterCount = handArray.map(
      (letter) => handArray.filter((x) => x == letter).length,
    );

    if (letterCount[0] == 5) {
      // five of a kind
      return 6;
    }

    if (letterCount[0] == 4 || letterCount[1] == 4) {
      if (joker && letterCount[0] == 4) {
        const otherLetter = handArray.filter((x) => x != handArray[0])[0];
        if (otherLetter == "J") {
          // five of a kind
          return 6;
        }
      }
      // four of a kind
      return 5;
    }

    if (letterCount[0] == 3 || letterCount[1] == 3 || letterCount[2] == 3) {
      let repeatingLetter = "";
      if (letterCount[0] == 3) {
        repeatingLetter = handArray[0];
      } else if (letterCount[1] == 3) {
        repeatingLetter = handArray[1];
      } else {
        repeatingLetter = handArray[2];
      }

      const notThree = handArray.filter((letter) => letter != repeatingLetter);

      if (joker && (notThree[0] == "J" || notThree[1] == "J")) {
        // four of a kind
        return 5;
      }

      if (notThree[0] == notThree[1]) {
        // full house
        return 4;
      }

      // three of a kind
      return 3;
    }

    const count =
      Number(letterCount[0] == 2) +
      Number(letterCount[1] == 2) +
      Number(letterCount[2] == 2) +
      Number(letterCount[3] == 2) +
      Number(letterCount[4] == 2);

    const jokerCount = handArray.filter((x) => x == "J").length;

    if (count == 4) {
      if (joker) {
        if (jokerCount == 2) {
          // four of a kind
          return 5;
        } else if (jokerCount == 1) {
          // full house
          return 4;
        }
      }
      // two pair
      return 2;
    }

    if (count == 2) {
      if (joker && jokerCount == 1) {
        // three of a kind
        return 3;
      }
      // one pair
      return 1;
    }

    if (joker && jokerCount == 1) {
      // one pair
      return 1;
    }

    // high card
    return 0;
  };

  return (
    <Puzzle
      handleGetResults={() => processData(data)}
      handleExampleGetResults={() => processData(exampleData)}
      day={day}
      results={parts}
    ></Puzzle>
  );

  function orderHands(hands: Hand[], joker: boolean): Hand[] {
    const orderedHands: Hand[] = [];
    for (let i = 0; i < handTypes.length; i++) {
      const handsOfType = hands.filter((hand) => hand.type == i);
      const jokerHandsOfType = hands.filter((hand) => hand.jokerType == i);

      let tempHands: Hand[] = [];
      if (joker) {
        tempHands = jokerHandsOfType;
      } else {
        tempHands = handsOfType;
      }
      const rankOrderedHandsOfType = tempHands.sort(function (a, b) {
        let j = 0;
        while (j < 5) {
          if (joker) {
            if (a.jokerRank[j] == b.jokerRank[j]) {
              j++;
            } else {
              return a.jokerRank[j] - b.jokerRank[j];
            }
          } else {
            if (a.rank[j] == b.rank[j]) {
              j++;
            } else {
              return a.rank[j] - b.rank[j];
            }
          }
        }
      });
      orderedHands.push(...rankOrderedHandsOfType);
    }
    return orderedHands;
  }

  function getHands(data: string[]) {
    const hands: Hand[] = [];
    data.forEach((row) => {
      const [handString, bidString] = row.split(" ");
      const handArray = handString.split("");
      const bid = Number(bidString);
      const type = GetHandType(handArray, false);
      const jokerType = GetHandType(handArray, true);
      const rank = handArray.map((letter) => cardRank.indexOf(letter));
      const jokerRank = handArray.map((letter) =>
        jokerCardRank.indexOf(letter),
      );
      const hand: Hand = {
        hand: handString,
        type: type,
        jokerType: jokerType,
        rank: rank,
        jokerRank: jokerRank,
        bid: bid,
      };
      hands.push(hand);
    });
    return hands;
  }
}
