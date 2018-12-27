import { rmdir } from "fs";

/**
 * 生成基于 Microsoft.AspNet.OData.ODataController 的 AbcController.cs
 */


function lv0(models: string, content: string) {
    const pre = models.replace('Models', '')
    const ss = `using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNet.OData;
using Microsoft.AspNetCore.Mvc;
using ${models};

namespace ${pre}.Controllers
{
${rMv4(content)}
}
`
    return ss
}

function lv1(m: string, content: string) {
    const ss = `public class ${m}Controller : ODataController
{
${rMv4(content)}
}`
    return ss
}

function rMv4(content: string) {
    return content.split('\n').map(e => '    ' + e).join('\n')
}

function fnInti() {
    return `
    private AdContext _db;
    public PersonController(AdContext context)
    {
        _db = context;
    }`
}

function fnGetList() {
    return `[EnableQuery]
public IActionResult Get()
{
    return Ok(_db.Person);
}`
}

function fnSinle() {
    return `[EnableQuery]
public IActionResult Get(int key)
{
    return Ok(_db.Person.FirstOrDefault(c => c.Id == key));
}`
}

function fnAdd() {
    return `[EnableQuery]
public IActionResult Post([FromBody]Person book)
{
    _db.Person.Add(book);
    _db.SaveChanges();
    return Created(book);
}`
}

function fnAttch() {
    return `[EnableQuery]
public IActionResult Put(int key, [FromBody]Person book)
{
    var b = _db.Person.FirstOrDefault(c => c.Id == key);
    if (b == null)
    {
        return NotFound();
    }
    b.Name = book.Name;
    _db.SaveChanges();
    return Ok();
}`
}

function fnDelete() {
    return `[EnableQuery]
public IActionResult Delete([FromBody]int key)
{
    var b = _db.Person.FirstOrDefault(c => c.Id == key);
    if (b == null)
    {
        return NotFound();
    }
    _db.Person.Remove(b);
    _db.SaveChanges();
    return Ok();
}`
}

export function generate() {

}
