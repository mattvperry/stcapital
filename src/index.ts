import Decimal from 'decimal.js';
import { Contract, ethers } from 'ethers';

import { IUniswapV2Factory__factory, IUniswapV2Pair, IUniswapV2Pair__factory } from './contracts/uniswapv2';
import { IUniswapV3Factory__factory, IUniswapV3Pool, IUniswapV3Pool__factory } from './contracts/uniswapv3';

type ContractReturn<TContract extends Contract, TFunc extends keyof TContract> = ReturnType<
    TContract[TFunc]
> extends Promise<infer R>
    ? R
    : never;

const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545');

const getPrice = (reserves: ContractReturn<IUniswapV2Pair, 'getReserves'>): number => {
    const [a, b] = reserves;
    return Number(ethers.utils.formatUnits(a, 18)) / Number(ethers.utils.formatUnits(b, 18));
};

const formatPrice = (slot0: ContractReturn<IUniswapV3Pool, 'slot0'>): number => {
    const factor = new Decimal(2).pow(96);
    const sqrtPrice = new Decimal(slot0.sqrtPriceX96.toString());
    const ratio = sqrtPrice.dividedBy(factor).pow(2);
    return new Decimal(1).dividedBy(ratio).toNumber();
};

const main = async () => {
    const sushiFactory = IUniswapV2Factory__factory.connect('0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac', provider);

    const uniFactory = IUniswapV3Factory__factory.connect('0x1F98431c8aD98523631AE4a59f267346ea31F984', provider);

    const daiAddress = '0x6b175474e89094c44da98b954eedeac495271d0f';
    const wethAddress = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';

    const sushiPair = IUniswapV2Pair__factory.connect(await sushiFactory.getPair(wethAddress, daiAddress), provider);

    const uniPair = IUniswapV3Pool__factory.connect(await uniFactory.getPool(wethAddress, daiAddress, 3000), provider);

    provider.on('block', async (blockNum) => {
        console.log('---- NEW BLOCK ----');

        const sushiPrice = getPrice(await sushiPair.getReserves());
        console.log(`Sushi: ${sushiPrice}`);

        const uniPrice = formatPrice(await uniPair.slot0());
        console.log(`Uni: ${uniPrice}`);

        console.log(`Diff: ${Math.abs(sushiPrice - uniPrice)}`);

        console.log('\n');
    });
};

void main();
