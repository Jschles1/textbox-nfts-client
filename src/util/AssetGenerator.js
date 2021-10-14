import { File } from "nft.storage";
import { firstWords, secondWords, thirdWords, colors } from "./constants";

const AssetGenerator = {
  pickRandomWord(words) {
    return words[Math.floor(Math.random() * words.length)];
  },
  generate(contract) {
    const svgPartOne =
      "<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { fill: white; font-family: serif; font-size: 24px; }</style><rect width='100%' height='100%' fill='";
    const svgPartTwo =
      "'/><text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>";

    const first = this.pickRandomWord(firstWords);
    const second = this.pickRandomWord(secondWords);
    const third = this.pickRandomWord(thirdWords);
    const color = this.pickRandomWord(colors);

    const combinedWord = first + second + third;

    // Todo: Query contract to see if name already minted?
    console.log("Current Contract: ", contract);

    const finalSvg =
      svgPartOne + color + svgPartTwo + combinedWord + "</text></svg>";
    console.log("finalSvg", finalSvg);

    // const encodedSvg = 'data:image/svg+xml;base64,' + btoa(finalSvg);

    const asset = {
      name: combinedWord,
      description: "A highly acclaimed collection of squares.",
      image: new File([finalSvg], "textbox.svg", { type: "image/svg" }),
    };

    return asset;
  },
};

export default AssetGenerator;
