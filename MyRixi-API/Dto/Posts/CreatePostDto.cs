﻿using System.ComponentModel.DataAnnotations;
using MyRixiApi.Dto.Tags;

namespace MyRixiApi.Dto.Posts;

public class CreatePostDto
{
    [Required(ErrorMessage = "Title is required")]
    public string Title { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "Content is required")]
    public string Content { get; set; } = string.Empty;
    
    public List<CreateTagDto>? Tags { get; set; } = new();
}