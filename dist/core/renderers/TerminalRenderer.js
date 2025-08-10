export class TerminalRenderer {
    render(buffer) {
        const lines = buffer.map((row) => row.join('')).join('\n');
        process.stdout.write('\x1Bc'); // Clear screen (ANSI)
        process.stdout.write(lines + '\n');
    }
}
