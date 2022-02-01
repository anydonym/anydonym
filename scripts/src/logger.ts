// deno-lint-ignore-file no-explicit-any
import * as colors from 'https://deno.land/std@0.123.0/fmt/colors.ts';

interface LoggerOptions {
	name: string;

	level: {
		debug: boolean;
		log: boolean;
		info: boolean;
		warn: boolean;
		severe: boolean;
		fatal: boolean;
	};
}

class Logger {
	constructor(public options: LoggerOptions) {}

	#build(level: string, ...output: any[]) {
		return `${colors.gray(`[${new Date().toISOString()}]`)} | ${level}: ${output.join(' ')}`;
	}

	debug(...output: any[]) {
		if (this.options.level.debug) {
			console.debug(this.#build(colors.blue('debug'), output));
		}
	}

	log(...output: any[]) {
		if (this.options.level.log) {
			console.log(this.#build(colors.cyan('log'), output));
		}
	}

	info(...output: any[]) {
		if (this.options.level.info) {
			console.log(this.#build(colors.brightGreen('info'), output));
		}
	}

	warn(...output: any[]) {
		if (this.options.level.warn) {
			console.log(this.#build(colors.yellow('warn'), output));
		}
	}

	severe(output: Error): void;
	severe(...output: any[]) {
		if (this.options.level.severe) {
			if (output instanceof Error) {
				console.log(
					this.#build(
						colors.red(`severe [${output.name}]`),
						colors.yellow(`${output.message}\n${output.stack}`),
					),
				);
			} else {
				const get_stk = () => {
					const obj = {};
					Error.captureStackTrace(obj, this.fatal);
					return (<{ stack: any }> obj).stack;
				};

				console.log(
					this.#build(colors.red('severe'), colors.yellow(output.join(' ') + '\n' + get_stk())),
				);
			}
		}
	}

	fatal(output: Error): void;
	fatal(...output: any[]) {
		if (this.options.level.fatal) {
			if (output instanceof Error) {
				console.log(
					this.#build(
						colors.brightRed(`fatal [${output.name}]`),
						colors.red(`${output.message}\n${output.stack}`),
					),
				);
			} else {
				const get_stk = () => {
					const obj = {};
					Error.captureStackTrace(obj, this.fatal);
					return (<{ stack: any }> obj).stack;
				};

				console.log(
					this.#build(colors.brightRed('fatal'), colors.red(output.join(' ') + '\n' + get_stk())),
				);
			}
		}
	}
}

export { colors, Logger, type LoggerOptions };
