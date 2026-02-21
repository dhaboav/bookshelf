interface props {
    content: string;
}

function Button({ content }: props) {
    return (
        <button className="bg-primary hover:bg-primary/90 rounded-2xl p-2">
            <p className="text-sm text-white">{content}</p>
        </button>
    );
}

export default Button;
