import * as b from 'bobril';
import * as bs from 'bobrilstrap';
import { app } from './src/app';

bs.init();
b.init(() => app());