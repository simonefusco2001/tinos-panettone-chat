const TinoChat = () => {
  return (
    <div className="h-full w-full">
      <iframe
        src={`${import.meta.env.BASE_URL}tino-chat-app.html`}
        className="w-full h-full border-0 rounded-lg"
        title="Tino - Il Tuo Lievitista Digitale"
      />
    </div>
  );
};

export default TinoChat;
