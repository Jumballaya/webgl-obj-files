import { Line } from "../types/obj.type";
import { ObjLexer } from "./Lexer";

export class Parser {

    private lexer: ObjLexer;

    constructor(input: string) {
        this.lexer = new ObjLexer(input);
    }

    public parse() {
        const tokenizer = this.lexer.parse();
        let nextToken = tokenizer.next();
        while (!nextToken.done) {
            this.parseLine(nextToken.value);
        }
    }

    private parseLine(line: Line) {}
}
