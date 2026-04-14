from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()


class Item(BaseModel):
    name: str
    price: float
    is_offer: bool | None = None
    

items_db = []


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int):
    item = items_db[item_id]  
    return {"item_id": item_id, "name": item.name}


@app.put("/items/{item_id}")
def update_item(item_id: int):
    item = items_db[item_id]
    return {"item_name": item.name, "item_id": item_id}


@app.post("/items/")
def create_item(item: Item):
    items_db.append(item)
    return item