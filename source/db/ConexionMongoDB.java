package db;

import com.mongodb.MongoClientSettings;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoDatabase;
import org.bson.codecs.configuration.CodecRegistries;
import org.bson.codecs.configuration.CodecRegistry;
import org.bson.codecs.pojo.PojoCodecProvider;

/**
 * Clase para manejar la conexión con MongoDB.
 */
public class ConexionMongoDB {
    private MongoClient mongoClient;
    private MongoDatabase database;
    
    /**
     * Abre la conexión con la base de datos MongoDB y devuelve la instancia de la base de datos.
     */
    public MongoDatabase open() {
        String connectionString = "mongodb://127.0.0.1:27017";
        PojoCodecProvider pojoCodecProvider = PojoCodecProvider.builder().automatic(true).build();
        CodecRegistry pojoCodecRegistry = CodecRegistries.fromRegistries(
                MongoClientSettings.getDefaultCodecRegistry(), 
                CodecRegistries.fromProviders(pojoCodecProvider)
        );
        
        mongoClient = MongoClients.create(connectionString);
        database = mongoClient.getDatabase("bizzfizz").withCodecRegistry(pojoCodecRegistry);
        return database;
    }
    
    /**
     * Cierra la conexión con la base de datos MongoDB.
     */
    public void close() {
        if (mongoClient != null) {
            mongoClient.close();
        }
    }
}
