import re

with open('src/services/reports.service.ts', 'r', encoding='utf-8') as f:
    code = f.read()

code = code.replace('''      return onSnapshot(q, (snapshot) => {
        const reports = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Report));
        callback(reports);
      });''', '''      return onSnapshot(q, (snapshot) => {
        const reports = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Report));
        callback(reports);
      }, onError);''')

with open('src/services/reports.service.ts', 'w', encoding='utf-8') as f:
    f.write(code)