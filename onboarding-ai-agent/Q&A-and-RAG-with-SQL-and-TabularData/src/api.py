from flask import Flask, request, jsonify
from utils.chatbot import ChatBot
import os
from flask_cors import CORS
 
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}},
     supports_credentials=True)
 
@app.route('/api/query', methods=['POST'])
def query_database():
    """
    Endpoint to query the database using natural language
   
    Expected JSON payload:
    {
        "message": "Your question about the data",
        "chat_type": "Q&A with stored SQL-DB" | "Q&A with stored CSV/XLSX SQL-DB" | "RAG with stored CSV/XLSX ChromaDB" | "Q&A with Uploaded CSV/XLSX SQL-DB",
        "app_functionality": "Chat"
    }
    """
    data = request.get_json()
   
    if not data or 'message' not in data:
        return jsonify({"error": "Missing required field 'message'"}), 400
   
    message = data.get('message')
    chat_type = data.get('chat_type', 'Q&A with stored SQL-DB')
    app_functionality = data.get('app_functionality', 'Chat')
   
    # Initialize empty chatbot history
    chatbot = []
   
    try:
        # Call the ChatBot.respond method
        result = ChatBot.respond(chatbot, message, chat_type, app_functionality)
       
        # Log the result for debugging
        print(result)  # Log the result to understand the structure
       
        # Handle the result based on its type
        if isinstance(result, dict) and 'output' in result:
            # Direct dictionary output format
            return jsonify({"response": result['output']})
        elif isinstance(result, tuple) and len(result) == 2:
            # Handle tuple format with chatbot history as the second item
            chatbot_history = result[1]
            if chatbot_history and len(chatbot_history) > 0:
                # Get the last response from the chatbot history
                response_text = chatbot_history[-1][1]  # Get the last bot response
                return jsonify({"response": response_text})
            else:
                return jsonify({"error": "No response generated"}), 500
        else:
            # Unknown format
            return jsonify({"error": "Unrecognized response format from ChatBot"}), 500
    except Exception as e:
        return jsonify({"error": str(e), "trace": str(e.__traceback__)}), 500
 
@app.route('/api/health', methods=['GET'])
def health_check():
    """Simple health check endpoint"""
    return jsonify({"status": "healthy", "message": "API is running"})
 
if __name__ == '__main__':
    # Run the Flask app
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)