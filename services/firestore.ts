import firebase from "firebase";
import {
  CollectionReference,
  DocumentReference,
  Query,
  FieldValue
} from "@google-cloud/firestore";
import {
  GetMethodParams,
  IsTypeQuery,
  UpdateMethodParams,
  AddMethodParams,
  SetMethodParams,
  PutMethodStorageParams
} from "~/types/api";

export class FirestoreServices {
  private refFromPath = (path: string) => {
    const childPaths = path.split("/");

    let ref;
    switch (childPaths.length) {
      case 0: // only collection
        ref = firebase.firestore().collection(path);
        break;
      case 1: // only collection
        ref = firebase.firestore().collection(childPaths[0]);
        break;
      case 2: // document
        ref = firebase
          .firestore()
          .collection(childPaths[0])
          .doc(childPaths[1]);
        break;
      case 3: // subcollection 2rd
        ref = firebase
          .firestore()
          .collection(childPaths[0])
          .doc(childPaths[1])
          .collection(childPaths[2]);
        break;
      case 4: // document in subcollection
        ref = firebase
          .firestore()
          .collection(childPaths[0])
          .doc(childPaths[1])
          .collection(childPaths[2])
          .doc(childPaths[3]);
        break;

      default:
        console.log("over 3 level");
        break;
    }
    return ref;
  };

  public addArrayFirestore = (data: Object) => {
    return firebase.firestore.FieldValue.arrayUnion(data);
  };

  public deleteElementArrayFirestore = (data: Object) => {
    return firebase.firestore.FieldValue.arrayRemove(data);
  };

  public deleteArrayFirestore = () => {
    return firebase.firestore.FieldValue.delete();
  };

  public deleteDocument = async (path: string) => {
    const ref = (this.refFromPath(path) as unknown) as DocumentReference;
    if (ref) {
      const result = await ref.delete();
      return result;
    }
  };

  public get = async (body: GetMethodParams) => {
    const { path, type, structuredQuery } = body;
    if (type === IsTypeQuery.document) {
      const ref = (this.refFromPath(path) as unknown) as DocumentReference;
      if (ref) {
        const result = await ref.get();
        return {
          id: result.id,
          data: result.data()
        };
      }
    } else if (type === IsTypeQuery.collection) {
      let data: any = [];
      const ref = (this.refFromPath(path) as unknown) as CollectionReference;
      let queryRef: Query = ref;
      if (structuredQuery) {
        const {
          where,
          orderBy,
          limit,
          offset,
          startAfter,
          endAt,
          endBefore
        } = structuredQuery;

        if (where) {
          where.forEach(element => {
            const { fieldPath, opStr, value } = element;
            queryRef = queryRef.where(fieldPath, opStr, value);
          });
        }
      }

      const querySnap = await queryRef.get();

      querySnap.forEach(doc => {
        data.push({
          id: doc.id,
          data: doc.data()
        });
      });

      return data;
    }
  };

  public add = async (body: AddMethodParams) => {
    const { path, data } = body;
    const ref = (this.refFromPath(path) as unknown) as CollectionReference;
    const newData = Object.assign({}, { ...data });
    const result = await ref.add(newData);

    return {
      id: result.id
    };
  };

  public update = async (body: UpdateMethodParams) => {
    const { path, data } = body;
    const ref = (this.refFromPath(path) as unknown) as DocumentReference;
    const newData = Object.assign({}, { ...data });
    const result = await ref.update(newData);

    return result;
  };

  public set = async (body: SetMethodParams) => {
    const { path, data, options } = body;
    const ref = (this.refFromPath(path) as unknown) as DocumentReference;
    const newData = Object.assign({}, { ...data });
    if (options) {
      const result = await ref.set(newData, { merge: true });
      return result;
    } else {
      const result = await ref.set(newData);
      return result;
    }
  };
}

export class StorageServices {
  private storageRef(path: string) {
    return firebase
      .storage()
      .ref()
      .child(path);
  }

  public storagePut(body: PutMethodStorageParams) {
    const { path, data } = body;
    return this.storageRef(path).put(data);
  }

  public storageDelete(path: string) {
    return this.storageRef(path).delete();
  }

  public async storageGetDownloadUrl(path: string) {
    const url = await this.storageRef(path).getDownloadURL();
    return url;
  }
}

export class AuthenticationServices {
  public currentUser() {
    return firebase.auth().currentUser;
  }
}
