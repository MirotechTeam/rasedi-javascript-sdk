import { Buffer } from 'buffer';
import * as process from 'process';

(window as any).Buffer = Buffer;
(window as any).process = process;
