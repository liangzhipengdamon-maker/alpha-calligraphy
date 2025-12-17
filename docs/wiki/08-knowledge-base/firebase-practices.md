# Firebase最佳实践

## 🔥 优化建议

### 1. 查询优化

```typescript
// ❌ 避免：全表扫描
const docs = await getDocs(collection(db, "evaluations"));

// ✅ 推荐：使用where子句
const q = query(
  collection(db, "evaluations"),
  where("userId", "==", userId),
  orderBy("evaluatedAt", "desc"),
  limit(10)
);
const docs = await getDocs(q);
```

### 2. 批量操作

```typescript
// ✅ 使用batch减少调用次数
const batch = writeBatch(db);

evaluations.forEach(eval => {
  batch.set(doc(db, "evaluations", eval.id), eval);
});

await batch.commit();
```

### 3. 缓存策略

```typescript
// 启用离线持久化
firebase.firestore().enablePersistence()
  .catch((err) => console.log('Persistence error:', err));
```

---

**最后更新**: 2025-12-04
