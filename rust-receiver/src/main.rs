use amiquip::{
    Connection, ConsumerMessage, ConsumerOptions, Exchange, Publish, QueueDeclareOptions, Result,
};
use serde::{Deserialize, Serialize};
use serde_json;

use std::thread::{self, JoinHandle};

#[derive(Serialize, Deserialize, Debug)]
struct QueuePattern {
    target: String,
    cmd: String,
}

#[derive(Serialize, Deserialize, Debug)]
struct ProcessCompleteDto {
    pattern: String,
    data: String,
}

fn receiver_queue() -> JoinHandle<()> {
    thread::spawn(|| {
        let mut conn = Connection::insecure_open("amqp://guest:guest@rabbitmq:5672")
            .expect("Connection not established");
        let channel = conn.open_channel(None).expect("Unable to connect");
        println!("Creating the queue");
        let queue = channel
            .queue_declare("receiver_queue", QueueDeclareOptions::default())
            .expect("Queue creation failed");

        let publisher_queue = channel
            .queue_declare("process_complete", QueueDeclareOptions::default())
            .expect("Publisher queue creation failed");
        println!("Queue created");
        let consumer = queue
            .consume(ConsumerOptions::default())
            .expect("Failed to create a consumer");
        println!("Waiting for messages. Press Ctrl-C to exit.");
        let exchange = Exchange::direct(&channel);
        for (i, message) in consumer.receiver().iter().enumerate() {
            match message {
                ConsumerMessage::Delivery(delivery) => {
                    let body = String::from_utf8_lossy(&delivery.body);
                    println!("({:>3}) Received [{}]", i, body);
                    consumer
                        .ack(delivery)
                        .expect("Could not send the acknowledgement");

                    let process_notify = ProcessCompleteDto {
                        pattern: "completed".into(),
                        data: "Process has been completed".into(),
                    };

                    let json_string = serde_json::to_string(&process_notify).unwrap();

                    let process_complete = exchange
                        .publish(Publish::new(json_string.as_bytes(), publisher_queue.name()));

                    match process_complete {
                        Ok(_) => {
                            println!("[INFO] Message published on process complete")
                        }
                        Err(err) => {
                            println!(
                                "[ERROR] An error has occured while sending data into exchange {}",
                                err.to_string()
                            );
                        }
                    }
                }
                other => {
                    println!("Consumer ended: {:?}", other);
                    break;
                }
            }
        }
    })
}

fn error_queue() -> JoinHandle<()> {
    thread::spawn(|| {
        let mut conn = Connection::insecure_open("amqp://guest:guest@rabbitmq:5672")
            .expect("Connection not established");
        let channel = conn.open_channel(None).expect("Unable to connect");
        // println!("Creating the queue");

        let err_q = channel
            .queue_declare("error_log", QueueDeclareOptions::default())
            .expect("Error queue could not be created");

        let err_c = err_q
            .consume(ConsumerOptions::default())
            .expect("failed to create consumer");
        println!("[INFO] Listening on Error queue");
        for (i, message) in err_c.receiver().iter().enumerate() {
            match message {
                ConsumerMessage::Delivery(delivery) => {
                    let body = String::from_utf8_lossy(&delivery.body);
                    println!("({:>3}) Received [{}]", i, body);
                }
                other => {
                    println!("Consumer ended: {:?}", other);
                    break;
                }
            }
        }
    })
}
fn main() -> Result<()> {
    // let conn = Connection::insecure_open("amqp://guest:guest@localhost:5672")?;

    println!("Starting receiver queue thread");
    let receiver_queue_handle = receiver_queue();
    // let err_queue_handle = error_queue();

    receiver_queue_handle.join().unwrap();
    // err_queue_handle.join().unwrap();
    // conn.close();
    Ok(())
}
