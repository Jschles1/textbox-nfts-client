import { File } from 'nft.storage';
import { firstWords, secondWords, thirdWords, colors } from './constants';
import api from '../api';

const AssetGenerator = {
    pickRandomWord(words) {
        return words[Math.floor(Math.random() * words.length)];
    },
    async generateWord(contractAddress) {
        const first = this.pickRandomWord(firstWords);
        const second = this.pickRandomWord(secondWords);
        const third = this.pickRandomWord(thirdWords);
        const combinedWord = first + second + third;

        const mintedNfts = await api.getNFTCollection(contractAddress);
        let takenNames;

        // If NFT was already minted with combinedWord, then generate another word
        if (mintedNfts && mintedNfts.length) {
            takenNames = mintedNfts.map((nft) => nft.name);

            console.log('taken names', takenNames);

            if (takenNames.includes(combinedWord)) {
                return this.generateWord(contractAddress);
            } else {
                return combinedWord;
            }
        }

        return combinedWord;
    },
    async generate(contractAddress) {
        const svgPartOne =
            "<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { fill: white; font-family: serif; font-size: 24px; }</style><rect width='100%' height='100%' fill='";
        const svgPartTwo = "'/><text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>";

        const combinedWord = await this.generateWord(contractAddress);
        const color = this.pickRandomWord(colors);

        const finalSvg = svgPartOne + color + svgPartTwo + combinedWord + '</text></svg>';
        console.log('finalSvg', finalSvg);

        const asset = {
            name: combinedWord,
            description: 'A highly acclaimed collection of squares.',
            image: new File([finalSvg], 'textbox.svg', { type: 'image/svg' }),
        };

        return asset;
    },
};

export default AssetGenerator;
